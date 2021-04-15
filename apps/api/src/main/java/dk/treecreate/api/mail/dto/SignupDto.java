package dk.treecreate.api.mail.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Size;

@Getter
@Setter
@ApiModel(description = "Information needed to send out a signup email")
public class SignupDto
{
  @Size(min = 5, max = 255)
  @ApiModelProperty(notes = "Email address to send a message to", example = "user@yahoo.mail")
  String email;
}
