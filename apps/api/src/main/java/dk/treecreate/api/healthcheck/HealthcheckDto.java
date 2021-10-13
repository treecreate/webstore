package dk.treecreate.api.healthcheck;

import dk.treecreate.api.utils.Environment;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/*
 * A Class had to be created to be able to assign examples
 * for Swagger UI generation
 */
@ApiModel("Healthcheck")
class HealthcheckDto
{
    @ApiModelProperty(name = "status", example = "OK")
    private String status;

    @ApiModelProperty(name = "message", example = "Server is Live")
    private String message;

    @ApiModelProperty(name = "Environment the api is running in", example = "development")
    private Environment environment;

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public String getMessage()
    {
        return message;
    }

    public void setMessage(String message)
    {
        this.message = message;
    }

    public Environment getEnvironment()
    {
        return environment;
    }

    public void setEnvironment(Environment environment)
    {
        this.environment = environment;
    }
}
