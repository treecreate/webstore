package dk.treecreate.api.order;

import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.contactinfo.ContactInfoRepository;
import dk.treecreate.api.designs.ContactInfoService;
import dk.treecreate.api.discount.DiscountRepository;
import dk.treecreate.api.order.dto.CreateOrderRequest;
import dk.treecreate.api.order.dto.GetOrdersResponse;
import dk.treecreate.api.transactionitem.TransactionItemRepository;
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
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("orders")
@Api(tags = {"Orders"})
public class OrderController
{
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    OrderService orderService;
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
        Order order = orderService.setupOrderFromCreateRequest(createOrderRequest);
        if (!orderService.verifyPrice(order))
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "The provided order price information did not match the price calculations");
        }
        // TODO - Call quickpay

        order = orderRepository.save(order);
        if (order.getDiscount() != null)
        {
            discountRepository.save(order.getDiscount());
        }
        return order;
    }
}
