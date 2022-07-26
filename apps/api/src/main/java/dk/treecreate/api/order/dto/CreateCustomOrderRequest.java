package dk.treecreate.api.order.dto;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreateCustomOrderRequest
{
    @NotBlank
    @Size(min = 1, max = 100)
    @ApiModelProperty(name = "The name of the custom request", required = true,
        example = "A plate to show an achievement")
    private String name;

    @NotBlank
    @Size(min = 1, max = 254)
    @Email
    @ApiModelProperty(name = "The email of the user", example = "user@example.com", required = true)
    private String email;

    @NotBlank
    @Size(min = 1, max = 1000)
    @ApiModelProperty(name = "The custom order decription",
        example = "The plate that displays an achievement like in the picture", required = true)
    private String description;

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public String toJsonString()
    {
        return "{" +
            "\"name\": \"" + name + '\"' +
            ",\"email\": \"" + email + '\"' +
            ",\"description\": \"" + description + '\"' +
            '}';
    }
}
