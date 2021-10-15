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

    /**
     * Returns link that is used for account verification
     *
     * @param token  user-specific UUID token
     * @param locale what locale the redirected page should be opened in
     * @return the verification  link with a token
     */
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

    /**
     * Returns link that is included in the reset password email
     *
     * @param token  user-specific UUID token
     * @param locale what locale the redirected page should be opened in
     * @return the reset password link with a token
     */
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


    /**
     * Returns url that can be assigned to the payment link as the url it should redirect to after a failed/successful payment
     *
     * @param environment what environment the app is running in. Affects the domain
     * @param locale      what locale the redirected page should be opened in
     * @param successLink whether the link is for a success of payment cancelled redirect
     * @return the url for redirect
     */
    public String generatePaymentRedirectUrl(Environment environment, Locale locale,
                                             boolean successLink)
    {
        String route = successLink ? "/payment/success" : "/payment/cancelled";
        String lang = locale.equals(Locale.ENGLISH) ? "/en-US" : "/dk";
        switch (environment)
        {
            case PRODUCTION:
                return "https://treecreate.dk" + lang + route;
            case STAGING:
                return "https://testing.treecreate.dk" + lang + route;
            default:
                return "http://localhost:4200" + route;
        }
    }

    /**
     * Returns url that can be assigned to the payment and payment link as the callback url
     *
     * @param environment what environment the app is running in. Affects the domain
     * @return the url for redirect
     */
    public String generateCallbackUrl(Environment environment)
    {
        String route = "/paymentCallback";
        switch (environment)
        {
            case PRODUCTION:
                return "https://api.treecreate.dk" + route;
            case STAGING:
                return "https://api.testing.treecreate.dk" + route;
            default:
                return "http://localhost:5000" + route;
        }
    }
}
