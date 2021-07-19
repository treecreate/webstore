package dk.treecreate.api.authentication.dto.response;

import dk.treecreate.api.authentication.models.Role;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Set;
import java.util.UUID;

@ApiModel
public class RegisterUserSuccessfulResponse
{

    @ApiModelProperty(notes = "A list of roles the user can have",
        example = "[\"ROLE_USED\", \"ROLE_DEVELOPER\", \"ROLE_ADMIN\"]")
    private Set<Role> roles;


    @ApiModelProperty(notes = "UUID of the user entity",
        example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
    private UUID userId;

    @ApiModelProperty(notes = "Same as user's email", example = "example@hotdeals.dev")
    private String username;

    @ApiModelProperty(notes = "User's email", example = "example@hotdeals.dev")
    private String email;

    public RegisterUserSuccessfulResponse(UUID userId, String email, Set<Role> roles)
    {
        this.roles = roles;
        this.userId = userId;
        this.username = email;
        this.email = email;
    }

    public Set<Role> getRoles()
    {
        return roles;
    }

    public void setRoles(Set<Role> roles)
    {
        this.roles = roles;
    }

    public UUID getUserId()
    {
        return userId;
    }

    public void setUserId(UUID userId)
    {
        this.userId = userId;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }
}
