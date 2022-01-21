package dk.treecreate.api.discount;

import dk.treecreate.api.discount.dto.CreateDiscountRequest;
import dk.treecreate.api.discount.dto.GetDiscountsResponse;
import dk.treecreate.api.discount.dto.UpdateDiscountRequest;
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
    @Autowired
    DiscountService discountService;

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

    // TODO - change mapping to something like GET /discounts/code/:discountCode for better readbility
    @GetMapping("{discountCode}")
    @Operation(summary = "Get discount by discount code")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Discount information",
            response = Discount.class),
        @ApiResponse(code = 404, message = "Discount not found")})
    public Discount getByDiscountCode(
        @ApiParam(name = "discountCode", example = "ExampleDiscount2021")
        @PathVariable String discountCode)
    {
        return discountRepository.findByDiscountCode(discountCode)
            .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
    }

    // TODO - add tests for GET /discounts/:discountId
    @GetMapping("{discountId}/id")
    @Operation(summary = "Get a discount")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public Discount getOne(
        @ApiParam(name = "discountId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID discountId)
    {
        return discountRepository.findByDiscountId(discountId)
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
        discount.setIsEnabled(createDiscountRequest.getIsEnabled());
        if (createDiscountRequest.getExpiresAt() != null)
        {
            discount.setExpiresAt(createDiscountRequest.getExpiresAt());
        }
        if (createDiscountRequest.getStartsAt() != null)
        {
            discount.setStartsAt(createDiscountRequest.getStartsAt());
        }
        if (discountRepository.existsByDiscountCode(createDiscountRequest.getDiscountCode()))
        {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate discount code");
        }
        return discountRepository.save(discount);
    }

    // TODO - add tests for PATCH /discounts/:discountId

    /**
     * Update discount with delect information
     *
     * @param discountId            Id of the discount entity
     * @param updateDiscountRequest DTO with information about fields that should be updated
     * @return updated entity
     */
    @PatchMapping("/{discountId}")
    @Operation(summary = "Update discount with select information")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public Discount update(
        @ApiParam(name = "discountId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID discountId,
        @RequestBody(required = false) @Valid UpdateDiscountRequest updateDiscountRequest)
    {
        return discountService.updateDiscountEntity(updateDiscountRequest, discountId);
    }
}
