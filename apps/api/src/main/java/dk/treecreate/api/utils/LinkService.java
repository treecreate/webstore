package dk.treecreate.api.utils;

import dk.treecreate.api.config.CustomPropertiesConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.UUID;

@Service
public class LinkService
{
    @Autowired
    CustomPropertiesConfig customProperties;

    public String generateVerificationLink(UUID token, Locale locale)
    {
        String route = "/verification/" + token.toString();
        String lang = locale.equals(Locale.ENGLISH) ? "/en-US" : "/dk";
        switch (customProperties.getEnvironment())
        {
            case PRODUCTION:
                return "https://treecreate.dk" + lang + route;
            case STAGING:
                return "https://testing.treecreate.dk" + lang + route;
            default:
                return "http://localhost:4200" + route;
        }
    }

    public String generateResetPasswordLink(UUID token, Locale locale)
    {
        String route = "/resetPassword/" + token.toString();
        String lang = locale.equals(Locale.ENGLISH) ? "/en-US" : "/dk";
        switch (customProperties.getEnvironment())
        {
            case PRODUCTION:
                return "https://treecreate.dk" + lang + route;
            case STAGING:
                return "https://testing.treecreate.dk" + lang + route;
            default:
                return "http://localhost:4200" + route;
        }
    }
}
