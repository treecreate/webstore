package dk.treecreate.api.mail.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.Size;

@ApiModel(description = "Information needed to send out a reset password email")
public class ResetPasswordDto {
  @Size(min = 5, max = 255)
  @ApiModelProperty(notes = "Email address to send a message to", example = "user@yahoo.mail")
  String email;

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
}
