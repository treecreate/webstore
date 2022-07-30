package dk.treecreate.api.errorlog.dto;

import dk.treecreate.api.utils.HashMapConverter;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.Convert;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Map;
import java.util.UUID;

public class CreateErrorlogRequest
{
    @NotBlank
    @Size(max = 80)
    @ApiModelProperty(example = "webstore.example.com", required = true)
    private String name;

    @NotNull
    @ApiModelProperty(notes = "userId associated with this event",
        example = "c0a80121-7ac0-190b-817a-c08ab0a12345", required = true)
    private UUID userId;

    @NotBlank
    @Size(max = 30)
    @ApiModelProperty(name = "Clients browser information", example = "Chrome 105", required = true)
    private String browser;

    @NotBlank
    @Size(max = 50)
    @ApiModelProperty(name = "Page url", example = "https://treecreate.dk/login", required = true)
    private String url;

    @NotNull
    @ApiModelProperty(name = "Whether the client is running in production mode or not",
        example = "true", required = true)
    private Boolean production;

    @ApiModelProperty(notes = "The actual error, as a JSON string", required = false)
    @Convert(converter = HashMapConverter.class)
    private Map<String, Object> error;

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public UUID getUserId()
    {
        return userId;
    }

    public void setUserId(UUID userId)
    {
        this.userId = userId;
    }

    public String getBrowser()
    {
        return browser;
    }

    public void setBrowser(String browser)
    {
        this.browser = browser;
    }

    public String getUrl()
    {
        return url;
    }

    public void setUrl(String url)
    {
        this.url = url;
    }

    public Boolean getProduction()
    {
        return production;
    }

    public void setProduction(Boolean production)
    {
        this.production = production;
    }

    public Map<String, Object> getError()
    {
        return error;
    }

    public void setError(Map<String, Object> error)
    {
        this.error = error;
    }
}
