package dk.treecreate.api.config;

import dk.treecreate.api.utils.Environment;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import static org.hibernate.bytecode.BytecodeLogger.LOGGER;

@Component
@ConfigurationProperties("treecreate.app")
public class CustomPropertiesConfig
{
    private String quickpaySecret;

    private Environment environment = Environment.DEVELOPMENT;

    public String getQuickpaySecret()
    {
        return quickpaySecret;
    }

    public void setQuickpaySecret(String quickpaySecret)
    {
        this.quickpaySecret = quickpaySecret;
    }

    public Environment getEnvironment()
    {
        return environment;
    }

    public void setEnvironment(String environmentType)
    {
        if (environmentType.equals("PRODUCTION"))
        {
            this.environment = Environment.PRODUCTION;
        } else if (environmentType.equals("STAGING"))
        {
            this.environment = Environment.STAGING;
        } else
        {
            this.environment = Environment.DEVELOPMENT;
        }

        LOGGER.info("Environment type set to " + environment);
    }

}
