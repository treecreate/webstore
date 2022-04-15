package dk.treecreate.api.mail;

import dk.treecreate.api.order.Order;
import dk.treecreate.api.order.OrderService;
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
import java.math.BigDecimal;
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
    @Autowired
    OrderService orderService;

    public MailService(TemplateEngine templateEngine,
                       @Qualifier("getJavaInfoMailSender") JavaMailSender infoMailSender,
                       @Qualifier("getJavaOrderMailSender") JavaMailSender orderMailSender)
    {
        this.templateEngine = templateEngine;
        this.infoMailSender = infoMailSender;
        this.orderMailSender = orderMailSender;
    }

    public void sendSignupEmail(String to, Locale locale)
        throws UnsupportedEncodingException, MessagingException
    {
        Context context = new Context(locale);
        context.setVariable("email", to);
        String subject = locale.getLanguage().equals("dk") ? "Velkomment til Treecreate" :
            "Welcome to Treecreate";
        sendMail(to, MailDomain.INFO, subject, context, MailTemplate.SIGNUP);
    }

    public void sendSignupEmailOnOrder(String to, UUID token, Locale locale)
        throws UnsupportedEncodingException, MessagingException
    {
        Context context = new Context(locale);
        context.setVariable("email", to);
        context.setVariable("resetPasswordLink",
            linkService.generateResetPasswordLink(token, locale));
        String subject = locale.getLanguage().equals("dk") ? "Velkomment til Treecreate" :
            "Welcome to Treecreate";
        sendMail(to, MailDomain.INFO, subject, context, MailTemplate.SIGNUP_ON_ORDER);
    }

    public void sendNewsletterDiscountEmail(String to, Locale locale,
                                            String unsubscribeNewsletterUrl)
        throws UnsupportedEncodingException, MessagingException
    {
        Context context = new Context(locale);
        context.setVariable("email", to);
        context.setVariable("unsubscribeNewsletterUrl", unsubscribeNewsletterUrl);
        String subject =
            locale.getLanguage().equals("dk") ? "Her er din rabatkode - Team Treecreate!" :
                "Here's your discount - Team Treecreate!";
        sendMail(to, MailDomain.INFO, subject, context, MailTemplate.NEWSLETTER_DISCOUNT);
    }

    public void sendResetPasswordEmail(String to, UUID token, Locale locale)
        throws UnsupportedEncodingException, MessagingException
    {
        Context context = new Context(locale);
        context.setVariable("email", to);
        context.setVariable("resetPasswordLink",
            linkService.generateResetPasswordLink(token, locale));
        String subject = locale.getLanguage().equals("dk") ? "Skift kodeord" : "Reset password";
        sendMail(to, MailDomain.INFO, subject, context, MailTemplate.RESET_PASSWORD);
    }

    public void sendOrderConfirmationEmail(String to, Order order)
        throws UnsupportedEncodingException, MessagingException
    {
        // Calculate delivery price. Calulcations return total + delivery price, so we substract the total
        BigDecimal deliveryPrice =
            orderService.calculateDeliveryPrice(order.getShippingMethod(), order.getTotal())
                .subtract(order.getTotal());

        // Set Variables
        Context context = new Context(new Locale("dk"));
        context.setVariable("email", to);
        context.setVariable("order", order);
        context.setVariable("deliveryPrice", deliveryPrice);
        String subject = "Treecreate - Order Confirmation";

        sendMail(to, MailDomain.INFO, subject, context, MailTemplate.ORDER_CONFIRMATION);
        sendMail(MailDomain.ORDER.label, MailDomain.INFO, subject, context,
            MailTemplate.ORDER_CONFIRMATION);
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
