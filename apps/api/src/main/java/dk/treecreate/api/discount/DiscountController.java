package dk.treecreate.api.discount;

import dk.treecreate.api.discount.dto.CreateDiscountRequest;
import dk.treecreate.api.discount.dto.GetDiscountsResponse;
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

    @PostMapping("")
    @Operation(summary = "Create a discount")
    @ApiResponses(value = {
        @ApiResponse(code = 201, message = "Discount information",
            response = Discount.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public Discount create(
        @RequestBody() @Valid CreateDiscountRequest createDiscountRequest)
    {
        Discount discount = new Discount();
        discount.setDiscountCode(createDiscountRequest.getDiscountCode());
        discount.setRemainingUses(createDiscountRequest.getRemainingUses());
        discount.setTotalUses((createDiscountRequest.getTotalUses()));
        if (createDiscountRequest.getExpiresAt() != null)
        {
            discount.setExpiresAt(createDiscountRequest.getExpiresAt());
        }
        if (discountRepository.existsByDiscountCode(createDiscountRequest.getDiscountCode()))
        {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate discount code");
        }
        return discountRepository.save(discount);
    }
}
