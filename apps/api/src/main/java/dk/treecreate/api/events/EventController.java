package dk.treecreate.api.events;

import dk.treecreate.api.events.EventRepository.PagesViewed;
import dk.treecreate.api.events.EventRepository.RecentUsers;
import dk.treecreate.api.events.dto.CreateEventRequest;
import dk.treecreate.api.events.dto.GetEventsResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.List;
import java.util.UUID;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("events")
@Api(tags = {"Events"})
public class EventController {
  @Autowired EventRepository eventRepository;
  @Autowired EventService eventsService;

  @GetMapping()
  @Operation(summary = "Get all events")
  @ApiResponses(
      value = {
        @ApiResponse(code = 200, message = "A list of events", response = GetEventsResponse.class)
      })
  @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
  public List<Event> getEvents(
      @Parameter(name = "name", description = "Event name", example = "webstore.cookies-accepted")
          @RequestParam(required = false)
          String name,
      @Parameter(
              name = "userId",
              description = "Event userId",
              example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
          @RequestParam(required = false)
          UUID userId) {
    if (name != null && userId != null) {
      return eventRepository.findByNameAndUserIdOrderByCreatedAtDesc(name, userId);
    } else if (name != null && userId == null) {
      return eventRepository.findByNameOrderByCreatedAtDesc(name);
    } else if (name == null && userId != null) {
      return eventRepository.findByUserIdOrderByCreatedAtDesc(userId);
    } else {
      return eventRepository.findAllByOrderByCreatedAtDesc();
    }
  }

  @GetMapping("recent-users")
  @Operation(summary = "Get recent users count")
  @ApiResponses(
      value = {
        @ApiResponse(
            code = 200,
            message = "A list of currently active users",
            response = GetEventsResponse.class)
      })
  @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
  public List<RecentUsers> getRecentUsers(
      @Parameter(
              name = "duration",
              description = "How long of users activity should be returned",
              example = "10")
          @RequestParam(required = false)
          Integer duration,
      @Parameter(
              name = "interval",
              description = "In what second intervals should the data be grouped and reported",
              example = "10")
          @RequestParam(required = false)
          Integer interval) {
    if (duration == null) {
      duration = 10;
    }
    if (interval == null) {
      interval = 10;
    }
    return eventsService.getRecentUsers(duration, interval);
  }

  @GetMapping("pages-viewed")
  @Operation(summary = "Get pages viewed breakdown")
  @ApiResponses(
      value = {
        @ApiResponse(
            code = 200,
            message = "A list of pages viewed and their count",
            response = GetEventsResponse.class)
      })
  @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
  public List<PagesViewed> getPagesViewed(
      @Parameter(
              name = "daysOffsetA",
              description =
                  "Offset of how many days from current date should it show data from. 0 means include newest records",
              example = "0")
          @RequestParam(required = false)
          Integer daysOffsetA,
      @Parameter(
              name = "daysOffsetB",
              description =
                  "Offset of how many days from current date should it show data from. 30 means records from 30 days ago",
              example = "30")
          @RequestParam(required = false)
          Integer daysOffsetB) {
    // Default to 30 days of history
    if (daysOffsetA == null) {
      daysOffsetA = 0;
    }
    if (daysOffsetB == null) {
      daysOffsetB = 30;
    }
    return eventsService.getPagesViewed(daysOffsetA, daysOffsetB);
  }

  @PostMapping()
  @Operation(summary = "Create a new event")
  @ApiResponses(
      value = {@ApiResponse(code = 200, message = "Event information", response = Event.class)})
  public Event createEvent(@RequestBody @Valid CreateEventRequest request) {
    Event event = new Event();
    event.setName(request.getName());
    event.setUserId(request.getUserId());
    event.setUrl(request.getUrl());
    event.setBrowser(request.getBrowser());
    event.setLocale(request.getLocale());
    event.setIsMobile(request.getIsMobile());
    event.setIsLoggedIn(request.getIsLoggedIn());
    return eventRepository.save(event);
  }
}
