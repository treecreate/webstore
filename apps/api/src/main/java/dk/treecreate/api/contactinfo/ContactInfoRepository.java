package dk.treecreate.api.contactinfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContactInfoRepository extends JpaRepository<ContactInfo, Long>
{
    Optional<ContactInfo> findByContactInfoId(UUID contactInfoId);
}
