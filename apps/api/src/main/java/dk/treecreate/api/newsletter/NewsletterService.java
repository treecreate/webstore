package dk.treecreate.api.newsletter;

import dk.treecreate.api.discount.DiscountService;
import dk.treecreate.api.discount.DiscountType;
import dk.treecreate.api.discount.dto.CreateDiscountRequest;
import dk.treecreate.api.mail.MailService;
import dk.treecreate.api.utils.LinkService;
import dk.treecreate.api.utils.LocaleService;
import dk.treecreate.api.utils.StringService;
import io.sentry.Sentry;
import java.io.UnsupportedEncodingException;
import java.util.Calendar;
import java.util.UUID;
import javax.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NewsletterService {
  @Autowired StringService stringService;
  @Autowired MailService mailService;
  @Autowired LocaleService localeService;
  @Autowired LinkService linkService;
  @Autowired DiscountService discountService;

  /**
   * Creates a discount code string. Does not create a discount object. Generated code length: 20
   *
   * @return generated discount code.
   */
  public String generateDiscountCode() {
    return generateDiscountCode("", 20);
  }

  /**
   * Creates a discount code string. Does not create a discount object. Generated code length: 20
   *
   * @param suffix text that the discount code should start with.
   * @return generated discount code.
   */
  public String generateDiscountCode(String suffix) {
    return generateDiscountCode(suffix, 20);
  }

  /**
   * Creates a discount code string. Does not create a discount object.
   *
   * @param length the length of the generated part of the discount code.
   * @return generated discount code.
   */
  public String generateDiscountCode(int length) {
    return generateDiscountCode("", length);
  }

  /**
   * Creates a discount code string. Does not create a discount object.
   *
   * @param suffix text that the discount code should start with.
   * @param length the length of the generated part of the discount code.
   * @return generated discount code.
   */
  public String generateDiscountCode(String suffix, int length) {
    if (suffix.length() + length >= 50) {
      throw new IllegalArgumentException(
          "The suffix and length combined can't be longer than 50 characters");
    }

    if (suffix.length() + length < 1) {
      throw new IllegalArgumentException(
          "The suffix and length combined have to be at least 1 character");
    }
    return suffix + stringService.generateRandomString(length, false);
  }

  /**
   * Send a newsletter signup email to the person that signed up. Includes a generated discount code
   * of 10% off.
   *
   * @param email the email address to send the message to.
   * @param lang the localization of the email.
   * @param newsletterId the ID of the newsletter. Used for the unsubscribe link.
   * @throws MessagingException Mail sending issue.
   * @throws UnsupportedEncodingException Mail sending issue.
   */
  public void sendNewsletterDiscountEmail(String email, String lang, UUID newsletterId)
      throws MessagingException, UnsupportedEncodingException {

    String unsubscribeNewsletterUrl =
        linkService.generateNewsletterUnsubscribeLink(newsletterId, localeService.getLocale(null));

    // generate the discount code
    String discountCode;
    try {
      do {
        discountCode = generateDiscountCode("N", 8);
      } while (discountService.discountExists(discountCode));

    } catch (IllegalArgumentException e) {
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "An error has occurred while generating the discount code");
    }
    // Create a discount in the database
    CreateDiscountRequest request = new CreateDiscountRequest();
    request.setDiscountCode(discountCode);
    request.setAmount(10);
    request.setType(DiscountType.PERCENT);
    request.setRemainingUses(1);
    request.setTotalUses(0);
    request.setIsEnabled(true);
    // Set the discount to expire in one month
    Calendar cal = Calendar.getInstance();
    cal.add(Calendar.MONTH, 1);
    request.setExpiresAt(cal.getTime());

    discountService.createDiscount(request);

    // Send intro letter with discount
    mailService.sendNewsletterDiscountEmail(
        email, localeService.getLocale(lang), unsubscribeNewsletterUrl, discountCode);
    Sentry.captureMessage(
        "Newsletter signup discount email sent to: "
            + email
            + " with discount code "
            + discountCode);
  }
}
