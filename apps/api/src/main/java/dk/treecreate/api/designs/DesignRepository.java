package dk.treecreate.api.designs;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DesignRepository extends JpaRepository<Design, Long>
{
    Optional<Design> findByDesignId(UUID designId);
}
