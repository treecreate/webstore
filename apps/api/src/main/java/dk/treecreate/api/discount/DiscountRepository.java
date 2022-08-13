package dk.treecreate.api.discount;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {
  Boolean existsByDiscountCode(String discountCode);

  Optional<Discount> findByDiscountId(UUID discountId);

  Optional<Discount> findByDiscountCode(String discountCode);
}
