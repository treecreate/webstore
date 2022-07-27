package dk.treecreate.api.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class EventService
{

    @Autowired
    EventRepository eventRepository;

    public List<Event> updateEventUserId(UUID oldUserId, UUID newUserId)
    {
        List<Event> foundEvents = eventRepository.findByUserId(oldUserId);
        foundEvents.forEach(event -> event.setUserId(newUserId));
        eventRepository.saveAll(foundEvents);
        return foundEvents;
    }

}
