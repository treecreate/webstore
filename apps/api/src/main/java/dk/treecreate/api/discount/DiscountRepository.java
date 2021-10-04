package dk.treecreate.api.discount;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long>
{
    Boolean existsByDiscountCode(String discountCode);

    Optional<Discount> findByDiscountId(UUID discountId);
}
