package dk.treecreate.api.user.dto;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class UpdatePasswordRequest
{
    @NotBlank
    @Size(min = 6, max = 40)
    @ApiModelProperty(example = "abcDEF123", required = true)
    private String password;

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }
}
