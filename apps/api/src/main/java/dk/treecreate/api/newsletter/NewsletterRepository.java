package dk.treecreate.api.newsletter;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsletterRepository extends JpaRepository<Newsletter, Long> {
  Optional<Newsletter> findByEmail(String email);

  Optional<Newsletter> findByNewsletterId(UUID newsletterId);

  Boolean existsByEmail(String email);
}
