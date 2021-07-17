package dk.treecreate.api.authentication.dto.response;

import java.util.List;
import java.util.UUID;

public class JwtResponse
{
    private final List<String> roles;
    private String token;
    private String type = "Bearer";
    private UUID userId;
    private String email;

    public JwtResponse(String accessToken, UUID userId, String email,
                       List<String> roles)
    {
        this.token = accessToken;
        this.userId = userId;
        this.email = email;
        this.roles = roles;
    }

    public String getAccessToken()
    {
        return token;
    }

    public void setAccessToken(String accessToken)
    {
        this.token = accessToken;
    }

    public String getTokenType()
    {
        return type;
    }

    public void setTokenType(String tokenType)
    {
        this.type = tokenType;
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
