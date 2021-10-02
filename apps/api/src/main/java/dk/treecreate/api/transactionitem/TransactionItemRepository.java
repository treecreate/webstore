package dk.treecreate.api.transactionitem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionItemRepository extends JpaRepository<TransactionItem, Long>
{
    Optional<TransactionItem> findByTransactionItemId(UUID transactionId);

    @Query("SELECT item FROM TransactionItem item WHERE item.design.user.userId = ?1")
    List<TransactionItem> findByUserId(UUID userId);
}
