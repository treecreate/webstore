package dk.treecreate.api.discount;

import dk.treecreate.api.discount.dto.GetDiscountsResponse;
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
@RequestMapping("discounts")
@Api(tags = {"Discounts"})
public class DiscountController
{
    @Autowired
    DiscountRepository discountRepository;

    @GetMapping()
    @Operation(summary = "Get all discounts items")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "A list of transaction items",
            response = GetDiscountsResponse.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public List<Discount> getAll()
    {
        return discountRepository.findAll();
    }
}
