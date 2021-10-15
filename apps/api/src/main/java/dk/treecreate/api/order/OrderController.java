package dk.treecreate.api.order;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.contactinfo.ContactInfoRepository;
import dk.treecreate.api.designs.ContactInfoService;
import dk.treecreate.api.discount.DiscountRepository;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import dk.treecreate.api.order.dto.CreateOrderRequest;
import dk.treecreate.api.order.dto.GetOrdersResponse;
import dk.treecreate.api.transactionitem.TransactionItemRepository;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import dk.treecreate.api.utils.LocaleService;
import dk.treecreate.api.utils.QuickpayService;
import dk.treecreate.api.utils.model.quickpay.QuickpayOperationType;
import dk.treecreate.api.utils.model.quickpay.QuickpayStatusCode;
import dk.treecreate.api.utils.model.quickpay.dto.CreatePaymentLinkResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Locale;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("orders")
@Api(tags = {"Orders"})
public class OrderController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    OrderRepository orderRepository;
    @Autowired
    OrderService orderService;
    @Autowired
    QuickpayService quickpayService;
    @Autowired
    DiscountRepository discountRepository;
    @Autowired
    TransactionItemRepository transactionItemRepository;
    @Autowired
    ContactInfoRepository contactInfoRepository;
    @Autowired
    ContactInfoService contactInfoService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    AuthUserService authUserService;
    @Autowired
    private LocaleService localeService;

    @GetMapping()
    @Operation(summary = "Get all orders")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "A list of orders",
            response = GetOrdersResponse.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public List<Order> getAll()
    {
        return orderRepository.findAll();
    }

    @PostMapping("")
    @Operation(summary = "Create an order and get a payment link")
    @ApiResponses(value = {
        @ApiResponse(code = 201, message = "URL to quickpay that allows to make a payment",
            response = CreatePaymentLinkResponse.class)})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    @Transactional()
    public CreatePaymentLinkResponse createPayment(
        @RequestBody() @Valid CreateOrderRequest createOrderRequest,
        @Parameter(name = "lang",
            description = "Language of the email. Defaults to danish (dk)." +
                "\nValid values: 'en', 'dk'", example = "en") @RequestParam(required = false)
            String lang)
    {
        // Get the language
        Locale language = localeService.getLocale(lang);

        // check if the user is verified
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        LOGGER.info("Order | New order is being made. UserID: " + user.getUserId());
        if (!user.getIsVerified())
        {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                "The user had to be verified in order to create an order");
        }

        // Set up and verify the order object
        Order order = orderService.setupOrderFromCreateRequest(createOrderRequest);
        if (!orderService.verifyPrice(order))
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "The provided order price information did not match the price calculations");
        }
        // Call quickpay to obtain the payment link
        CreatePaymentLinkResponse createPaymentLinkResponse = null;
        try
        {
            String paymentId = quickpayService.sendCreatePaymentRequest(order);
            order.setPaymentId(paymentId);
            createPaymentLinkResponse =
                quickpayService.sendCreatePaymentLinkRequest(paymentId, order.getTotal(), language);
        } catch (URISyntaxException e)
        {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "An error has occurred while creating a payment");
        }
        // Persist the order information
        // TODO - error-handle failed order persisting. Include usage of transactions
        order = orderRepository.save(order);

        // Update the transaction items
        Order finalOrder = order;
        order.getTransactionItems().forEach(item -> {
            item.setOrder(finalOrder);
            transactionItemRepository.save(item);
        });

        if (order.getDiscount() != null)
        {
            discountRepository.save(order.getDiscount());
        }

        LOGGER.info(
            "Order | New order has been made. UserID: " + user.getUserId() + " | Order ID: " +
                order.getOrderId() + " | Payment ID: " + order.getPaymentId() + " | Subtotal: " +
                order.getSubtotal() + " | Total: " + order.getTotal());

        return createPaymentLinkResponse;
    }

    @ApiIgnore
    @PostMapping("/paymentCallback")
    public void paymentCallback(@RequestHeader("quickpay-checksum-sha256") String checksum,
                                @RequestBody String body)
    {
        ObjectMapper objectMapper = new ObjectMapper();
        try
        {
            JsonNode json = objectMapper.readTree(body);
            LOGGER.info("A payment callback request has been received");
            LOGGER.info(json.toString());
            // validate the checksum
            if (!quickpayService.validatePaymentCallbackChecksum(checksum, json.toString()))
            {
                LOGGER.warn("The request body checksum does not match");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "The request body checksum does not match");
            }

            LOGGER.info("Processing the operations data");
            JsonNode operations = json.get("operations");
            if (operations.isArray())
            {
                // get the latest operation
                ArrayNode arrayNode = (ArrayNode) operations;
                JsonNode latestOperation = arrayNode.get(arrayNode.size() - 1);
                JsonNode operationType = latestOperation.get("type");
                JsonNode operationStatus = latestOperation.get("qp_status_code");
                if (operationType == null || operationType.isNull())
                {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "The provided body is missing the necessary field: /operations/[" +
                            (arrayNode.size() - 1) + "]/type");
                }
                if (operationStatus == null || operationStatus.isNull())
                {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "The provided body is missing the necessary field: /operations/[" +
                            (arrayNode.size() - 1) + "]/qp_status_code");
                }

                LOGGER.info("Latest operation type: " + operationType.asText());
                LOGGER.info("Latest operation status: " + operationStatus.asInt());

                if (operationType.asText().equals(QuickpayOperationType.AUTHORIZE.label))
                {
                    LOGGER.info("Received callback is of operation type AUTHORIZE");
                    if (operationStatus.asInt() != QuickpayStatusCode.APPROVED.label)
                    {
                        LOGGER.warn("Operation status is " + operationStatus.asInt() +
                            ", aka not approved. Aborting");
                        return;
                    }

                    LOGGER.info("Operation status is APPROVED, sending out an email");

                    // Send out the email based on the orderId
                    JsonNode orderId = json.get("variables(orderId");
                    if (orderId == null || orderId.isNull())
                    {
                        // try to send the order based on the paymentID instead
                        JsonNode paymentId = json.get("id");
                        LOGGER.warn(
                            "The provided body does not contain orderId variable, sending email based on the paymentId instead");
                        if (paymentId == null || paymentId.isNull())
                        {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "The provided body is missing the necessary field: id");
                        }
                        LOGGER.info("Sending order confirmation email to order with paymentID: " +
                            paymentId.asText());
                        // TODO - call orderService to send the email
                    } else
                    {
                        LOGGER.info("Sending order confirmation email to: " + orderId.asText());
                        // TODO - call orderService to send the email
                    }

                } else
                {
                    LOGGER.info("Received callback is of operation type " + operationType.asText() +
                        ", ignoring (nothing coded for handling this operation)");
                    return;
                }
            }
            LOGGER.info("Finished processing the callback");
        } catch (JsonProcessingException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "An error has occurred while processing the callback", e);
        }
    }
}
