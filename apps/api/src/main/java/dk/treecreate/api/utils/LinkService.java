package dk.treecreate.api.utils;

import dk.treecreate.api.config.CustomPropertiesConfig;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Service
public class LinkService {
  @Autowired CustomPropertiesConfig customProperties;

  /**
   * Returns link that is included in the reset password email
   *
   * @param token user-specific UUID token
   * @param locale what locale the redirected page should be opened in
   * @return the reset password link with a token
   */
  public String generateResetPasswordLink(UUID token, Locale locale) {
    String route = "/resetPassword/" + token.toString();
    return getPath(locale, route, false);
  }

  /**
   * Returns url that can be assigned to the payment link as the url it should redirect to after a
   * failed/successful payment
   *
   * @param locale what locale the redirected page should be opened in
   * @param successLink whether the link is for a success of payment cancelled redirect
   * @return the url for redirect
   */
  public String generatePaymentRedirectUrl(Locale locale, boolean successLink) {
    String route = successLink ? "/payment/success" : "/payment/cancelled";
    return getPath(locale, route, false);
  }

  /**
   * Returns url that can be assigned to the payment and payment link as the callback url
   *
   * @return the url for redirect
   */
  public String generateCallbackUrl() {
    String route = "/paymentCallback";
    return getPath(null, route, true);
  }

  /**
   * Returns link that is included in the newsletter emails
   *
   * @param newsletterId id of the newsletter entry
   * @param locale what locale the redirected page should be opened in
   * @return the newsletter unsubscribe link with a newsletterId
   */
  public String generateNewsletterUnsubscribeLink(UUID newsletterId, Locale locale) {
    String route = "/newsletter/unsubscribe/" + newsletterId.toString();
    return getPath(locale, route, false);
  }

  // private method for combining the route, environment and locale into a link
  private String getPath(@Nullable Locale locale, String route, boolean isApi) {
    String lang = "";
    if (!isApi) {
      lang = locale.equals(Locale.ENGLISH) ? "/en-US" : "/da";
    }
    switch (customProperties.getEnvironment()) {
      case PRODUCTION:
        return "https://" + (isApi ? "api." : "") + "treecreate.dk" + lang + route;
      case STAGING:
        return "https://" + (isApi ? "api." : "") + "testing.treecreate.dk" + lang + route;
      default:
        return "http://localhost:" + (isApi ? "5050" : "4200") + route;
    }
  }
}
