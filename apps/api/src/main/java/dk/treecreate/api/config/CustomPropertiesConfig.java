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

    private Environment environmentType;

    public String getQuickpaySecret()
    {
        return quickpaySecret;
    }

    public void setQuickpaySecret(String quickpaySecret)
    {
        this.quickpaySecret = quickpaySecret;
    }

    public Environment getEnvironmentType()
    {
        return environmentType;
    }

    public void setEnvironmentType(String environmentType)
    {
        if ("production".equals(environmentType))
        {
            this.environmentType = Environment.PRODUCTION;
        } else
        {
            this.environmentType = Environment.DEVELOPMENT;
        }

        LOGGER.info("Environment type set to " + environmentType);
    }

}
