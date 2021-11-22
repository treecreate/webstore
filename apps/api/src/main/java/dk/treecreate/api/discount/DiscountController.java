package dk.treecreate.api.discount;

import dk.treecreate.api.discount.dto.CreateDiscountRequest;
import dk.treecreate.api.discount.dto.GetDiscountsResponse;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.Date;
import java.util.List;
import java.util.UUID;

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

    @GetMapping("{discountCode}")
    @Operation(summary = "Get discount by discount code")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Discount information",
            response = Discount.class),
        @ApiResponse(code = 404, message = "Discount not found")})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public Discount getByDiscountCode(
        @ApiParam(name = "discountCode", example = "ExampleDiscount2021")
        @PathVariable String discountCode)
    {
        return discountRepository.findByDiscountCode(discountCode)
            .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
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
        discount.setType(createDiscountRequest.getType());
        if (discount.getType().equals(DiscountType.PERCENT) &&
            createDiscountRequest.getAmount() > 100)
        {
            discount.setAmount(100);
        } else
        {
            discount.setAmount(createDiscountRequest.getAmount());
        }
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

    @PutMapping("/use/{discountId}")
    @Operation(summary = "Update discount with information that it has been used once")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Discount information",
            response = Discount.class),
        @ApiResponse(code = 404, message = "Discount not found")})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public Discount update(
        @ApiParam(name = "discountId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID discountId)
    {
        Discount discount = discountRepository.findByDiscountId(discountId)
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
        return discountRepository.save(discount);
    }
}
