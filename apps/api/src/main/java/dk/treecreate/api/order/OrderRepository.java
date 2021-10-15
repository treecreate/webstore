package dk.treecreate.api.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>
{
    Optional<Order> findByOrderId(UUID orderId);

    Optional<Order> findByPaymentId(String paymentId);
}
