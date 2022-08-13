package dk.treecreate.api.events.dto;

import io.swagger.annotations.ApiModelProperty;
import java.util.UUID;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class CreateEventRequest {
  @NotBlank
  @Size(max = 80)
  @ApiModelProperty(example = "webstore.example.com", required = true)
  private String name;

  @NotNull
  @ApiModelProperty(
      notes = "userId associated with this event",
      example = "c0a80121-7ac0-190b-817a-c08ab0a12345",
      required = true)
  private UUID userId;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }
}
