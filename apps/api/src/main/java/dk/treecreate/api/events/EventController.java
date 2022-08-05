package dk.treecreate.api.events;

import dk.treecreate.api.events.dto.CreateEventRequest;
import dk.treecreate.api.events.dto.GetEventsResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("events")
@Api(tags = {"Events"}) public class EventController
{
    @Autowired
    EventRepository eventRepository;

    @GetMapping()
    @Operation(summary = "Get all events")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "A list of events", response = GetEventsResponse.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')") public List<Event> getEvents(
        @Parameter(name = "name", description = "Event name",
            example = "webstore.cookies-accepted") @RequestParam(required = false) String name,
        @Parameter(name = "userId", description = "Event userId",
            example = "c0a80121-7ac0-190b-817a-c08ab0a12345") @RequestParam(
            required = false) UUID userId)
    {
        if (name != null && userId != null)
        {
            return eventRepository.findByNameAndUserIdOrderByCreatedAtDesc(name, userId);
        } else if (name != null && userId == null)
        {
            return eventRepository.findByNameOrderByCreatedAtDesc(name);
        } else if (name == null && userId != null)
        {
            return eventRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else
        {
            return eventRepository.findAllByOrderByCreatedAtDesc();
        }
    }

    @PostMapping()
    @Operation(summary = "Create a new event")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Event information",
            response = Event.class)})
    public Event createEvent(
        @RequestBody @Valid CreateEventRequest request
    )
    {
        Event event = new Event();
        event.setName(request.getName());
        event.setUserId(request.getUserId());
        return eventRepository.save(event);
    }
}
