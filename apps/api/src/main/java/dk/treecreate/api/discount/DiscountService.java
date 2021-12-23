package dk.treecreate.api.discount;

import dk.treecreate.api.discount.dto.UpdateDiscountRequest;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service @Transactional() public class DiscountService
{
    @Autowired
    DiscountRepository discountRepository;

    // TODO - add tests for the method

    /**
     * Update database entity of the given discount
     *
     * @param updateDiscountRequest The DTO with information about what should be updated
     * @param discountId            ID of the entity
     * @return updated entity object
     */
    public Discount updateDiscountEntity(UpdateDiscountRequest updateDiscountRequest,
                                         UUID discountId)
    {
        Discount discount = discountRepository.findByDiscountId(discountId)
            .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
        discount = setDiscountFields(discount, updateDiscountRequest);
        return discountRepository.save(discount);
    }

    // TODO - add tests for the method

    /**
     * Updates a discount object with the not-null fields from the DTO
     *
     * @param discount              discount object to be updated
     * @param updateDiscountRequest The DTO with information about what should be updated
     * @return updated object
     */
    public Discount setDiscountFields(Discount discount,
                                      UpdateDiscountRequest updateDiscountRequest)
    {
        System.out.println(updateDiscountRequest);
        if (updateDiscountRequest == null)
        {
            return discount;
        }
        if (updateDiscountRequest.getDiscountCode() != null)
        {
            discount.setDiscountCode(updateDiscountRequest.getDiscountCode());
        }
        if (updateDiscountRequest.getType() != null)
        {
            discount.setType(updateDiscountRequest.getType());
        }
        if (updateDiscountRequest.getAmount() != null)
        {
            discount.setAmount(updateDiscountRequest.getAmount());
        }
        if (updateDiscountRequest.getRemainingUses() != null)
        {
            discount.setRemainingUses(updateDiscountRequest.getRemainingUses());
        }
        if (updateDiscountRequest.getTotalUses() != null)
        {
            System.out.println("Updating total uses");
            discount.setTotalUses(updateDiscountRequest.getTotalUses());
        }
        if (updateDiscountRequest.getIsEnabled() != null)
        {
            discount.setIsEnabled(updateDiscountRequest.getIsEnabled());
        }
        if (updateDiscountRequest.getStartsAt() != null)
        {
            discount.setStartsAt(updateDiscountRequest.getStartsAt());
        }
        if (updateDiscountRequest.getExpiresAt() != null)
        {
            discount.setExpiresAt(updateDiscountRequest.getExpiresAt());
        }
        return discount;
    }
}
