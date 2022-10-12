package dk.treecreate.api.feedback.dto;

import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreateFeedbackRequest {

  @Size(min = 1, max = 254)
  @Email
  @ApiModelProperty(name = "The email of the user", example = "user@example.com", required = false)
  private String email;

  @NotBlank
  @Size(min = 1, max = 1000)
  @ApiModelProperty(
      name = "The custom order decription",
      example = "The plate that displays an achievement like in the picture",
      required = true)
  private String description;

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
}
