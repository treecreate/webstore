package dk.treecreate.api.authentication.dto.response;

import io.swagger.annotations.ApiModelProperty;

import java.util.List;
import java.util.UUID;

public class JwtResponse
{
    @ApiModelProperty(notes = "A list of roles the user can have",
        example = "[\"ROLE_USED\", \"ROLE_DEVELOPER\", \"ROLE_ADMIN\"]")
    private final List<String> roles;

    @ApiModelProperty(notes = "A JWT token with the user information encoded within it",
        example = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MUBob3RkZWFscy5kZXYiLCJpYXQiOjE2MjY3MjgwMDcsImV4cCI6MTYyNjgxNDQwN30.vGcbMzk3zt5P5uwLI9tLVS4GrRZZO7aVT-smrjwtu0LE2sYYY3xQbnwXdtkIAtckPxV1eGninvalid")
    private String accessToken;

    @ApiModelProperty(notes = "Type of authentication method", example = "Bearer")
    private String tokenType = "Bearer";

    @ApiModelProperty(notes = "UUID of the user entity",
        example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
    private UUID userId;

    @ApiModelProperty(notes = "User's email", example = "example@hotdeals.dev")
    private String email;

    public JwtResponse(String accessToken, UUID userId, String email,
                       List<String> roles)
    {
        this.accessToken = accessToken;
        this.userId = userId;
        this.email = email;
        this.roles = roles;
    }

    public String getAccessToken()
    {
        return accessToken;
    }

    public void setAccessToken(String accessToken)
    {
        this.accessToken = accessToken;
    }

    public String getTokenType()
    {
        return tokenType;
    }

    public void setTokenType(String tokenType)
    {
        this.tokenType = tokenType;
    }

    public UUID getUserId()
    {
        return userId;
    }

    public void setId(UUID id)
    {
        this.userId = id;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public List<String> getRoles()
    {
        return roles;
    }
}
