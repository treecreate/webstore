package dk.treecreate.api.contactinfo;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactInfoRepository extends JpaRepository<ContactInfo, Long> {
  Optional<ContactInfo> findByContactInfoId(UUID contactInfoId);
}
