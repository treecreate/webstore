package dk.treecreate.api.order;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
  Optional<Order> findByOrderId(UUID orderId);

  Optional<Order> findByPaymentId(String paymentId);

  List<Order> findByUserId(UUID userId);
}
