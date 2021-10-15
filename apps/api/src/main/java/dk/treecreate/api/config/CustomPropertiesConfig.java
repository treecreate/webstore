package dk.treecreate.api.config;

import dk.treecreate.api.utils.Environment;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import static org.hibernate.bytecode.BytecodeLogger.LOGGER;

@Component
@ConfigurationProperties("treecreate.app")
public class CustomPropertiesConfig
{
    private String quickpayApiKey;

    private String quickpayPrivateKey;

    private Environment environment = Environment.DEVELOPMENT;

    private String jwtSecret;

    private int jwtExpirationMs;

    public String getQuickpayApiKey()
    {
        return quickpayApiKey;
    }

    public void setQuickpayApiKey(String quickpayApiKey)
    {
        this.quickpayApiKey = quickpayApiKey;
    }

    public String getQuickpayPrivateKey()
    {
        return quickpayPrivateKey;
    }

    public void setQuickpayPrivateKey(String quickpayPrivateKey)
    {
        this.quickpayPrivateKey = quickpayPrivateKey;
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

    public String getJwtSecret()
    {
        return jwtSecret;
    }

    public void setJwtSecret(String jwtSecret)
    {
        this.jwtSecret = jwtSecret;
    }

    public int getJwtExpirationMs()
    {
        return jwtExpirationMs;
    }

    public void setJwtExpirationMs(int jwtExpirationMs)
    {
        this.jwtExpirationMs = jwtExpirationMs;
    }
}
