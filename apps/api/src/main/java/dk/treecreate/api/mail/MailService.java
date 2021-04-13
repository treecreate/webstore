package dk.treecreate.api.mail;

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

@Service
public class MailService
{
  private final TemplateEngine templateEngine;
  private final JavaMailSender javaMailSender;

  public MailService(TemplateEngine templateEngine, JavaMailSender javaMailSender)
  {
    this.templateEngine = templateEngine;
    this.javaMailSender = javaMailSender;
  }

  public void sendSignupEmail(String to, Locale locale) throws UnsupportedEncodingException, MessagingException
  {
    Context context = new Context(locale);
    context.setVariable("email", to);
    String subject = "Welcome to Treecreate";
    sendMail(to, MailDomain.INFO, subject, context, MailTemplate.SIGNUP);
  }

  public void sendResetPasswordEmail(String to, Locale locale) throws UnsupportedEncodingException, MessagingException
  {
    Context context = new Context(locale);
    context.setVariable("email", to);
    String subject = "Hello Customer, you forgot your password";
    sendMail(to, MailDomain.INFO, subject, context, MailTemplate.RESET_PASSWORD);
  }

  private void sendMail(String to, MailDomain from, String subject, Context context, MailTemplate template)
    throws MessagingException, UnsupportedEncodingException
  {
    String process = templateEngine.process("emails/" + template.label, context);
    javax.mail.internet.MimeMessage mimeMessage = javaMailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage,
      MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
      StandardCharsets.UTF_8.name());
    helper.setFrom(new InternetAddress(from.label, "Treecreate"));
    helper.setSubject(subject);
    helper.setText(process, true);
    helper.setTo(to);
    javaMailSender.send(mimeMessage);
  }

  public boolean isValidEmail(String email)
  {
    // Java mail does not check for length
    if (email.length() > 255) return false;
    try
    {
      new InternetAddress(email).validate();
      return true;
    } catch (AddressException e)
    {
      return false;
    }
  }

  public Locale getLocale(String lang)
  {
    if (lang == null) return new Locale("dk"); // default locale is danish
    else return new Locale(lang);
  }
}
