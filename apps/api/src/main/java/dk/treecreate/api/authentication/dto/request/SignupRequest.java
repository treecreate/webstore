package dk.treecreate.api.authentication.dto.request;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class SignupRequest
{
    @NotBlank
    @Size(max = 254)
    @Email
    @ApiModelProperty(example = "example@hotdeals.dev", required = true)
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    @ApiModelProperty(example = "abcDEF123", required = true)
    private String password;

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }
}
