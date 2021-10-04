package dk.treecreate.api.order;

import dk.treecreate.api.order.dto.GetOrdersResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("orders")
@Api(tags = {"Orders"})
public class OrderController
{
    @Autowired
    OrderRepository orderRepository;

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

}
