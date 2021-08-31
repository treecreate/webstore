package dk.treecreate.api.newsletter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NewsletterRepository extends JpaRepository<Newsletter, Long>
{
    Optional<Newsletter> findByEmail(String email);

    Optional<Newsletter> findByNewsletterId(UUID newsletterId);
}
