package dk.treecreate.api.mail;

import dk.treecreate.api.order.Order;
import dk.treecreate.api.utils.LinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.UUID;

@Service
public class MailService
{
    private final TemplateEngine templateEngine;

    private final JavaMailSender infoMailSender;
    private final JavaMailSender orderMailSender;

    @Autowired
    LinkService linkService;

    public MailService(TemplateEngine templateEngine,
                       @Qualifier("getJavaInfoMailSender") JavaMailSender infoMailSender,
                       @Qualifier("getJavaOrderMailSender") JavaMailSender orderMailSender)
    {
        this.templateEngine = templateEngine;
        this.infoMailSender = infoMailSender;
        this.orderMailSender = orderMailSender;
    }

    /**
     * Send a welcome email to new user
     *
     * @param to     the target email
     * @param token  the special id of the user
     * @param locale language the email should be sent in
     * @throws UnsupportedEncodingException
     * @throws MessagingException
     */
    public void sendSignupEmail(String to, UUID token, Locale locale)
        throws UnsupportedEncodingException, MessagingException
    {
        Context context = new Context(locale);
        context.setVariable("email", to);
        context.setVariable("verificationLink",
            linkService.generateVerificationLink(token, locale));
        String subject = "Welcome to Treecreate";
        sendMail(to, MailDomain.INFO, subject, context, MailTemplate.SIGNUP);
    }

    /**
     * Send a password reset email
     *
     * @param to     the target email
     * @param token  the special id of the user used to provide a link for resetting the password
     * @param locale language the email should be sent in
     * @throws UnsupportedEncodingException
     * @throws MessagingException
     */
    public void sendResetPasswordEmail(String to, UUID token, Locale locale)
        throws UnsupportedEncodingException, MessagingException
    {
        Context context = new Context(locale);
        context.setVariable("email", to);
        context.setVariable("resetPasswordLink",
            linkService.generateResetPasswordLink(token, locale));
        String subject = "Reset password";
        sendMail(to, MailDomain.INFO, subject, context, MailTemplate.RESET_PASSWORD);
    }

    public void sendVerificationEmail(String to, UUID token, Locale locale)
        throws UnsupportedEncodingException, MessagingException
    {
        Context context = new Context(locale);
        context.setVariable("email", to);
        context.setVariable("verificationLink",
            linkService.generateVerificationLink(token, locale));
        String subject = "Treecreate - verify email";
        sendMail(to, MailDomain.INFO, subject, context, MailTemplate.VERIFY_EMAIL);
    }


    /**
     * Send an order confirmation email
     *
     * @param to    the target email
     * @param order order object with order information
     * @throws UnsupportedEncodingException
     * @throws MessagingException
     */
    public void sendOrderConfirmationEmail(String to, Order order)
        throws UnsupportedEncodingException, MessagingException
    {
        // TODO: Add locale change so it can also be in english
        Context context = new Context(new Locale("dk"));
        context.setVariable("email", to);
        context.setVariable("order", order);
        String subject = "Treecreate - Order Confirmation";
        sendMail(to, MailDomain.INFO, subject, context, MailTemplate.ORDER_CONFIRMATION);
        sendMail(MailDomain.ORDER.label, MailDomain.INFO, subject, context,
            MailTemplate.ORDER_CONFIRMATION);
    }

    /**
     * Send an newsletter email with a discount for new newsletter subscriber
     *
     * @param to           the target email
     * @param newsletterId the id of the new newsletter signup
     * @param locale       language the email should be sent in
     * @throws UnsupportedEncodingException
     * @throws MessagingException
     */
    public void sendNewNewsletterSubscriberEmail(String to, UUID newsletterId, Locale locale)
        throws UnsupportedEncodingException, MessagingException
    {
        Context context = new Context(locale);
        context.setVariable("unsubscribeLink", linkService
            .generateNewsletterUnsubscribeLink(newsletterId, locale));
        // TODO: Set a proper subject
        String subject = "Welcome to Treecreate";
        sendMail(to, MailDomain.INFO, subject, context, MailTemplate.NEW_NEWSLETTER_SUBSCRIBER);
    }

    /**
     * Send a email based on the params
     *
     * @param to       the target email
     * @param from     domain the email should be sent under
     * @param subject  email subject
     * @param context  variables used throughout the email
     * @param template which email template to use
     * @throws MessagingException
     * @throws UnsupportedEncodingException
     */
    private void sendMail(String to, MailDomain from, String subject, Context context,
                          MailTemplate template)
        throws MessagingException, UnsupportedEncodingException
    {
        String process = templateEngine.process("emails/" + template.label, context);
        JavaMailSender mailSender = getMailSender(from);
        javax.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper =
            new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name());
        helper.setFrom(new InternetAddress(from.label, "Treecreate"));
        helper.setSubject(subject);
        helper.setText(process, true);
        helper.setTo(to);
        mailSender.send(mimeMessage);
    }

    /**
     * Is the provided email valid
     *
     * @param email email to verify
     * @return whether it is valid or not
     */
    public boolean isValidEmail(String email)
    {
        // Java mail does not check for length
        if (email.length() > 255)
            return false;
        try
        {
            new InternetAddress(email).validate();
            return true;
        } catch (AddressException e)
        {
            return false;
        }
    }

    /**
     * Get the account domain the email should be sent under
     *
     * @param mailDomain which domain to use
     * @return the domain
     */
    private JavaMailSender getMailSender(MailDomain mailDomain)
    {
        if (mailDomain == MailDomain.ORDER)
        {
            return orderMailSender;
        }
        return infoMailSender;
    }
}
