package dk.treecreate.api.events.dto;

import io.swagger.annotations.ApiModelProperty;
import java.time.LocalDateTime;
import java.util.Map;

public class GetRecentUsersResponse {

  @ApiModelProperty(notes = "A map of user count every 10 seconds")
  Map<LocalDateTime, Integer> usersOverTime;
}
