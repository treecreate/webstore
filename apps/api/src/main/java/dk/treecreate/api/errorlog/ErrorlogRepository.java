package dk.treecreate.api.errorlog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ErrorlogRepository extends JpaRepository<Errorlog, Long>
{
    List<Errorlog> findByName(String name);

    List<Errorlog> findByUserId(UUID userId);

    List<Errorlog> findByNameAndUserId(String name, UUID userId);
}
