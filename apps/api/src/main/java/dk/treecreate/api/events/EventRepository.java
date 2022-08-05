package dk.treecreate.api.events;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>
{
    List<Event> findAllByOrderByCreatedAtDesc();

    List<Event> findByNameOrderByCreatedAtDesc(String name);

    List<Event> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<Event> findByNameAndUserIdOrderByCreatedAtDesc(String name, UUID userId);
}
