package dk.treecreate.api.transactionitem;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionItemRepository extends JpaRepository<TransactionItem, Long> {
  Optional<TransactionItem> findByTransactionItemId(UUID transactionId);

  @Query("SELECT item FROM TransactionItem item WHERE item.design.user.userId = ?1")
  List<TransactionItem> findByUserId(UUID userId);

  @Query("SELECT item FROM TransactionItem item WHERE item.design.designId = ?1")
  List<TransactionItem> findByDesignId(UUID designId);
}
