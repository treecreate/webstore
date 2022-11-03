package dk.treecreate.api.events;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class EventService {

  @Autowired EventRepository eventRepository;

  public List<Event> updateEventUserId(UUID oldUserId, UUID newUserId) {
    List<Event> foundEvents = eventRepository.findByUserIdOrderByCreatedAtDesc(oldUserId);
    foundEvents.forEach(event -> event.setUserId(newUserId));
    eventRepository.saveAll(foundEvents);
    return foundEvents;
  }

  public Map<LocalDateTime, Integer> getRecentUsers(Integer duration) {
    var data = new TreeMap<LocalDateTime, Integer>();
    var time = LocalDateTime.now();
    data.put(time, 5);
    data.put(time.minus(Duration.ofSeconds(10)), 5);
    return data;
  }
}
