package dk.treecreate.api.mail;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import java.io.UnsupportedEncodingException;

@Service
public class MailService {

  private final TemplateEngine templateEngine;

  private final JavaMailSender javaMailSender;

  public MailService(TemplateEngine templateEngine, JavaMailSender javaMailSender) {
    this.templateEngine = templateEngine;
    this.javaMailSender = javaMailSender;
  }

  public String sendMail(User user, String template) throws MessagingException, UnsupportedEncodingException
  {
    Context context = new Context();
    context.setVariable("user", user);

    String process = templateEngine.process("emails/" + template, context);
    javax.mail.internet.MimeMessage mimeMessage = javaMailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
    helper.setFrom(new InternetAddress("info@treecreate.dk", "Treecreate"));
    helper.setSubject("Welcome " + user.getName());
    helper.setText(process, true);
    helper.setTo(user.getEmail());
    javaMailSender.send(mimeMessage);
    return "Sent";
  }
}
