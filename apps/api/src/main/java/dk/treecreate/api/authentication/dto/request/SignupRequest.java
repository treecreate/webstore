package dk.treecreate.api.authentication.dto.request;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

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

    @ApiModelProperty(notes = "A list of roles the user can have",
        example = "[\"ROLE_USED\", \"ROLE_DEVELOPER\", \"ROLE_ADMIN\"]", required = false)
    private Set<String> roles;

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

    public Set<String> getRoles()
    {
        return this.roles;
    }

    public void setRoles(Set<String> roles)
    {
        this.roles = roles;
    }
}
