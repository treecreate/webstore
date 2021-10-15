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

    public void sendResetPasswordEmail(String to, String token, Locale locale)
        throws UnsupportedEncodingException, MessagingException
    {
        Context context = new Context(locale);
        context.setVariable("email", to);
        context.setVariable("token", token);
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

    public void sendOrderconfirmationEmail(String to, Order order)
        throws UnsupportedEncodingException, MessagingException
    {
        // TODO: Add locale change so it can also be in english
        Context context = new Context(new Locale("dk"));
        context.setVariable("email", to);
        context.setVariable("order", order);
        String subject = "Treecreate - Order Confirmation";
        sendMail(to, MailDomain.INFO, subject, context, MailTemplate.ORDER_CONFIRMATION);
    }

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

    private JavaMailSender getMailSender(MailDomain mailDomain)
    {
        if (mailDomain == MailDomain.ORDER)
        {
            return orderMailSender;
        }
        return infoMailSender;
    }
}
