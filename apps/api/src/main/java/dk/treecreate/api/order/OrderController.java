package dk.treecreate.api.order;

import dk.treecreate.api.authentication.models.ERole;
import dk.treecreate.api.authentication.models.Role;
import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.contactinfo.ContactInfoRepository;
import dk.treecreate.api.designs.ContactInfoService;
import dk.treecreate.api.discount.DiscountRepository;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import dk.treecreate.api.order.dto.CreateCustomOrderRequest;
import dk.treecreate.api.order.dto.CreateOrderRequest;
import dk.treecreate.api.order.dto.GetAllOrdersResponse;
import dk.treecreate.api.order.dto.GetPlantedTreesResponse;
import dk.treecreate.api.order.dto.UpdateOrderRequest;
import dk.treecreate.api.transactionitem.TransactionItemRepository;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import dk.treecreate.api.utils.LocaleService;
import dk.treecreate.api.utils.OrderStatus;
import dk.treecreate.api.utils.QuickpayService;
import dk.treecreate.api.utils.model.quickpay.dto.CreatePaymentLinkResponse;
import dk.treecreate.api.utils.model.quickpay.dto.GetPaymentLinkResponse;
import io.sentry.Sentry;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("orders")
@Api(tags = {"Orders"})
public class OrderController {
  private static final Logger LOGGER = LoggerFactory.getLogger(OrderController.class);

  @Autowired OrderRepository orderRepository;
  @Autowired OrderService orderService;
  @Autowired QuickpayService quickpayService;
  @Autowired DiscountRepository discountRepository;
  @Autowired TransactionItemRepository transactionItemRepository;
  @Autowired ContactInfoRepository contactInfoRepository;
  @Autowired ContactInfoService contactInfoService;
  @Autowired UserRepository userRepository;
  @Autowired AuthUserService authUserService;
  @Autowired private LocaleService localeService;

  /**
   * Get a list of orders
   *
   * @param userId <i>Optional</i> query param user to filer orders for the given user
   * @return a list of orders
   */
  @GetMapping()
  @Operation(summary = "Get all orders")
  @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
  public List<Order> getAll(
      @Parameter(
              name = "userId",
              description = "Id of the user the listed orders belong to",
              example = "c0a80121-7ac0-190b-817a-c08ab0a12345",
              required = false)
          @RequestParam(required = false)
          UUID userId) {
    if (userId == null) {
      return orderRepository.findAll();
    }
    User currentUser =
        userRepository
            .findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    return orderRepository.findByUserId(currentUser.getUserId());
  }

  @GetMapping("me")
  @Operation(summary = "Get all orders of current user")
  @ApiResponses(
      value = {
        @ApiResponse(
            code = 200,
            message = "A list of orders",
            response = GetAllOrdersResponse.class)
      })
  @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
  public List<Order> getAllOrdersOfCurrentUser() {
    var userDetails = authUserService.getCurrentlyAuthenticatedUser();
    User currentUser =
        userRepository
            .findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    return orderRepository.findByUserId(currentUser.getUserId());
  }

  // TODO - add tests for GET /orders/:orderId
  @GetMapping("{orderId}")
  @Operation(summary = "Get an order")
  @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
  public Order getOne(
      @ApiParam(name = "orderId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345") @PathVariable
          UUID orderId) {
    return orderRepository
        .findByOrderId(orderId)
        .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
  }

  @PostMapping("")
  @Operation(summary = "Create an order and get a payment link")
  @ApiResponses(
      value = {
        @ApiResponse(
            code = 201,
            message = "URL to quickpay that allows to make a payment",
            response = CreatePaymentLinkResponse.class)
      })
  @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
  @Transactional()
  public CreatePaymentLinkResponse createPayment(
      @RequestBody() @Valid CreateOrderRequest createOrderRequest,
      @Parameter(
              name = "lang",
              description =
                  "Language of the email. Defaults to danish (dk)." + "\nValid values: 'en', 'da'",
              example = "en")
          @RequestParam(required = false)
          String lang) {
    // Get the language
    Locale language = localeService.getLocale(lang);

    var userDetails = authUserService.getCurrentlyAuthenticatedUser();
    User user =
        userRepository
            .findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    LOGGER.info("Order | New order is being made. UserID: " + user.getUserId());

    // Set up and verify the order object
    Order order = orderService.setupOrderFromCreateRequest(createOrderRequest);
    if (!orderService.verifyPrice(order)) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN,
          "The provided order price information did not match the price calculations");
    }
    // Call quickpay to obtain the payment link
    CreatePaymentLinkResponse createPaymentLinkResponse = null;
    try {
      String paymentId = quickpayService.sendCreatePaymentRequest(order);
      order.setPaymentId(paymentId);
      createPaymentLinkResponse =
          quickpayService.sendCreatePaymentLinkRequest(paymentId, order.getTotal(), language);
    } catch (URISyntaxException e) {
      e.printStackTrace();
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR, "An error has occurred while creating a payment");
    }
    // Persist the order information
    // TODO - error-handle failed order persisting. Include usage of transactions
    order = orderRepository.save(order);

    // Update the transaction items
    Order finalOrder = order;
    order
        .getTransactionItems()
        .forEach(
            item -> {
              item.setOrder(finalOrder);
              transactionItemRepository.save(item);
            });

    if (order.getDiscount() != null) {
      discountRepository.save(order.getDiscount());
    }

    LOGGER.info(
        "Order | New order has been made. UserID: "
            + user.getUserId()
            + " | Order ID: "
            + order.getOrderId()
            + " | Payment ID: "
            + order.getPaymentId()
            + " | Subtotal: "
            + order.getSubtotal()
            + " | Total: "
            + order.getTotal());

    Sentry.setExtra("orderId", order.getOrderId().toString());
    Sentry.setExtra("paymentId", order.getPaymentId());
    Sentry.setExtra("total", String.valueOf(order.getTotal()));
    Sentry.captureMessage("New order has been created");
    return createPaymentLinkResponse;
  }

  /**
   * Update the given order with select information. Will return a response with the full order if
   * it is successful or 404 - Not Found if there is no order with specified id.
   *
   * @param updateOrderRequest DTO for the request.
   * @param orderId the ID of the order.
   * @return the updated order.
   */
  @PatchMapping("{orderId}")
  @Operation(summary = "Update an order with select information")
  @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
  public Order updateOrder(
      @RequestBody(required = false) @Valid UpdateOrderRequest updateOrderRequest,
      @ApiParam(name = "orderId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345") @PathVariable
          UUID orderId) {
    return orderService.updateOrder(orderId, updateOrderRequest);
  }

  @GetMapping("{orderId}/link")
  @Operation(summary = "Get a link for the given order")
  @ApiResponses(
      value = {
        @ApiResponse(
            code = 200,
            message = "A quickpay payment link",
            response = GetPaymentLinkResponse.class)
      })
  @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
  public GetPaymentLinkResponse getPaymentLink(
      @ApiParam(name = "orderId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345") @PathVariable
          UUID orderId) {
    var userDetails = authUserService.getCurrentlyAuthenticatedUser();
    User currentUser =
        userRepository
            .findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    Order order =
        orderRepository
            .findByOrderId(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    if (order.getUserId().compareTo(currentUser.getUserId()) != 0) {
      // Determine whether the user is an admin or not
      boolean isAdmin = false;
      var roles = currentUser.getRoles();
      for (Role role : roles) {
        if (role.getName().equals(ERole.ROLE_ADMIN)) {
          isAdmin = true;
          break;
        }
      }
      if (!isAdmin) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN, "The order belongs to another user");
      }
    }

    try {
      return this.quickpayService.getPaymentLink(order.getPaymentId());
    } catch (URISyntaxException e) {
      LOGGER.error(
          "An error has occurred while getting a payment with id: " + order.getPaymentId(), e);
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR, "An error has occurred while getting a payment");
    }
  }

  @PostMapping("custom")
  @ResponseStatus(HttpStatus.ACCEPTED)
  @Operation(summary = "Create a custom order entry")
  public void createCustomOrder(@Valid CreateCustomOrderRequest request) {
    this.orderService.sendCustomOrderRequestEmail(request);
    LOGGER.info("Custom order request receieved from " + request.getEmail());
    Sentry.setExtra("request", request.toJsonString());
    Sentry.captureMessage("New order has been created");
  }

  @GetMapping("planted-trees")
  @Operation(summary = "Get a total of planted trees")
  public GetPlantedTreesResponse getTotalPlantedTrees() {
    return new GetPlantedTreesResponse(this.orderRepository.getPlantedTrees());
  }
}
