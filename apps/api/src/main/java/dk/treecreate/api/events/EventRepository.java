package dk.treecreate.api.events;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>
{
    List<Event> findByName(String name);

    List<Event> findByUserId(UUID userId);

    List<Event> findByNameAndUserId(String name, UUID userId);
}
