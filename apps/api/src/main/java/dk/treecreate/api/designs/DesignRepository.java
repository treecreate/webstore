package dk.treecreate.api.designs;

import dk.treecreate.api.user.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignRepository extends JpaRepository<Design, Long> {
  Optional<Design> findByDesignId(UUID designId);

  List<Design> findByUser(User user);
}
