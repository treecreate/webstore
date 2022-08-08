package dk.treecreate.api.errorlog;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ErrorlogRepository extends JpaRepository<Errorlog, Long> {
  Optional<Errorlog> findByErrorlogId(UUID errorlogId);

  List<Errorlog> findAllByOrderByCreatedAtDesc();

  List<Errorlog> findByNameOrderByCreatedAtDesc(String name);

  List<Errorlog> findByUserIdOrderByCreatedAtDesc(UUID userId);

  List<Errorlog> findByNameAndUserIdOrderByCreatedAtDesc(String name, UUID userId);
}
