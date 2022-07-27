package dk.treecreate.api.events.dto;

import dk.treecreate.api.events.Event;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

public class GetEventsResponse
{
    @ApiModelProperty(notes = "A list of events")
    List<Event> events;
}
