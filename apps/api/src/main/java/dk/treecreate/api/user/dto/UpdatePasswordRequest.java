package dk.treecreate.api.user.dto;

import io.swagger.annotations.ApiModelProperty;
import java.util.UUID;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class UpdatePasswordRequest {
  @NotNull
  @ApiModelProperty(example = "c0a80121-7ac0-190b-817a-c08ab0a12345", required = true)
  private UUID token;

  @NotBlank
  @Size(min = 8, max = 120)
  @ApiModelProperty(example = "abcDEF123", required = true)
  private String password;

  public UUID getToken() {
    return token;
  }

  public void setToken(UUID token) {
    this.token = token;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
