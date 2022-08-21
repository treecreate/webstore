package dk.treecreate.api.discount;

import dk.treecreate.api.discount.dto.CreateDiscountRequest;
import dk.treecreate.api.discount.dto.UpdateDiscountRequest;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional()
public class DiscountService {
  @Autowired DiscountRepository discountRepository;

  // TODO - add tests for the method

  public Discount createDiscount(CreateDiscountRequest request) {
    Discount discount = new Discount();
    discount.setType(request.getType());
    if (discount.getType().equals(DiscountType.PERCENT) && request.getAmount() > 100) {
      discount.setAmount(100);
    } else {
      discount.setAmount(request.getAmount());
    }
    discount.setDiscountCode(request.getDiscountCode());
    discount.setRemainingUses(request.getRemainingUses());
    discount.setTotalUses((request.getTotalUses()));
    discount.setIsEnabled(request.getIsEnabled());
    if (request.getExpiresAt() != null) {
      discount.setExpiresAt(request.getExpiresAt());
    }
    if (request.getStartsAt() != null) {
      discount.setStartsAt(request.getStartsAt());
    }
    if (discountRepository.existsByDiscountCode(request.getDiscountCode())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate discount code");
    }
    return discountRepository.save(discount);
  }

  /**
   * Update database entity of the given discount
   *
   * @param updateDiscountRequest The DTO with information about what should be updated
   * @param discountId ID of the entity
   * @return updated entity object
   */
  public Discount updateDiscountEntity(
      UpdateDiscountRequest updateDiscountRequest, UUID discountId) {
    Discount discount =
        discountRepository
            .findByDiscountId(discountId)
            .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
    discount = setDiscountFields(discount, updateDiscountRequest);
    return discountRepository.save(discount);
  }

  // TODO - add tests for the method

  /**
   * Updates a discount object with the not-null fields from the DTO
   *
   * @param discount discount object to be updated
   * @param updateDiscountRequest The DTO with information about what should be updated
   * @return updated object
   */
  public Discount setDiscountFields(
      Discount discount, UpdateDiscountRequest updateDiscountRequest) {
    System.out.println(updateDiscountRequest);
    if (updateDiscountRequest == null) {
      return discount;
    }
    if (updateDiscountRequest.getDiscountCode() != null) {
      // check that the discount code is not a duplicate of another discount
      if (!updateDiscountRequest.getDiscountCode().equals(discount.getDiscountCode())
          && this.discountRepository.existsByDiscountCode(
              updateDiscountRequest.getDiscountCode())) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "The provided discount code is already used by another discount");
      }
      discount.setDiscountCode(updateDiscountRequest.getDiscountCode());
    }
    if (updateDiscountRequest.getType() != null) {
      discount.setType(updateDiscountRequest.getType());
    }
    if (updateDiscountRequest.getAmount() != null) {
      discount.setAmount(updateDiscountRequest.getAmount());
    }
    if (updateDiscountRequest.getRemainingUses() != null) {
      discount.setRemainingUses(updateDiscountRequest.getRemainingUses());
    }
    if (updateDiscountRequest.getTotalUses() != null) {
      System.out.println("Updating total uses");
      discount.setTotalUses(updateDiscountRequest.getTotalUses());
    }
    if (updateDiscountRequest.getIsEnabled() != null) {
      discount.setIsEnabled(updateDiscountRequest.getIsEnabled());
    }
    if (updateDiscountRequest.getStartsAt() != null) {
      discount.setStartsAt(updateDiscountRequest.getStartsAt());
    }
    if (updateDiscountRequest.getExpiresAt() != null) {
      discount.setExpiresAt(updateDiscountRequest.getExpiresAt());
    }
    return discount;
  }
}
