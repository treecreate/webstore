package dk.treecreate.api.order;

import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.contactinfo.ContactInfo;
import dk.treecreate.api.contactinfo.ContactInfoRepository;
import dk.treecreate.api.designs.ContactInfoService;
import dk.treecreate.api.discount.Discount;
import dk.treecreate.api.discount.DiscountRepository;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import dk.treecreate.api.order.dto.CreateOrderRequest;
import dk.treecreate.api.order.dto.GetOrdersResponse;
import dk.treecreate.api.transactionitem.TransactionItem;
import dk.treecreate.api.transactionitem.TransactionItemRepository;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("orders")
@Api(tags = {"Orders"})
public class OrderController
{
    @Autowired
    OrderRepository orderRepository;
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
    @Operation(summary = "Create an order")
    @ApiResponses(value = {
        @ApiResponse(code = 201, message = "Order information",
            response = Order.class)})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public Order create(
        @RequestBody() @Valid CreateOrderRequest createOrderRequest)
    {
        Order order = new Order();
        // TODO - verify price calculations
        // TODO - Call quickpay
        order.setInitialPrice(createOrderRequest.getInitialPrice());
        order.setFullPrice(createOrderRequest.getFullPrice());
        order.setCurrency(createOrderRequest.getCurrency());
        order.setState(PaymentState.INITIAL);
        order.setPlantedTrees(createOrderRequest.getPlantedTrees());
        if (createOrderRequest.getDiscountId() != null)
        {
            Discount discount =
                discountRepository.findByDiscountId(createOrderRequest.getDiscountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
            if (discount.getRemainingUses() == 0)
            {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "This discount has no remaining uses");
            }
            if (discount.getExpiresAt() != null && new Date().after(discount.getExpiresAt()))
            {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This discount is expired");
            }

            discount.setRemainingUses(discount.getRemainingUses() - 1);
            discount.setTotalUses(discount.getTotalUses() + 1);
            order.setDiscount(discount);
        } else
        {
            order.setDiscount(null);
        }

        // set contact and billing info
        ContactInfo contactInfo = new ContactInfo();
        contactInfo = contactInfoService.mapCreateContactInfoRequest(contactInfo,
            createOrderRequest.getContactInfo());
        order.setContactInfo(contactInfo);
        if (createOrderRequest.getBillingInfo() != null)
        {
            ContactInfo billingInfo = new ContactInfo();
            billingInfo = contactInfoService.mapCreateContactInfoRequest(billingInfo,
                createOrderRequest.getBillingInfo());
            order.setBillingInfo(billingInfo);
        } else
        {
            order.setBillingInfo(null);
        }
        List<TransactionItem> itemList = new ArrayList<>();
        // set transaction items

        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        order.setUserId(user.getUserId());
        for (UUID itemId : createOrderRequest.getTransactionItemIds())
        {
            TransactionItem transactionItem =
                transactionItemRepository.findByTransactionItemId(itemId)
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction item not found"));
            // check if the user has access to the transaction item
            if (transactionItem.getDesign().getUser().getUserId() != user.getUserId())
            {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You lack clearance to create an order including this transaction item: '" +
                        transactionItem.getTransactionItemId() + "'");
            }
            itemList.add(transactionItem);
        }
        order.setTransactionItems(itemList);
        order = orderRepository.save(order);
        if (order.getDiscount() != null)
        {
            discountRepository.save(order.getDiscount());
        }
        return order;
    }
}
