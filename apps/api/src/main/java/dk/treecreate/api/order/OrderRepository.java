package dk.treecreate.api.order;

import dk.treecreate.api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>
{
    Optional<Order> findByOrderId(UUID orderId);

    Optional<Order> findByPaymentId(String paymentId);

    List<Order> findByUserId(UUID userId);
}
