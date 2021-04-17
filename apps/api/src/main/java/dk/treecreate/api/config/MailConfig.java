package dk.treecreate.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
@PropertySource(value = {"classpath:application.properties"})
public class MailConfig
{
  @Value("${spring.mail.host}")
  private String mailServerHost;

  @Value("${spring.mail.port}")
  private Integer mailServerPort;

  @Value("${spring.mail.password}")
  private String mailServerPassword;

  @Value("${spring.mail.properties.mail.smtp.auth}")
  private String mailServerAuth;

  @Value("${spring.mail.properties.mail.smtp.starttls.enable}")
  private String mailServerStartTls;

  // The two emails are hardcoded but they are not likely to change
  @Bean
  public JavaMailSender getJavaInfoMailSender()
  {
    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    mailSender.setUsername("info@treecreate.dk");
    return configureJavaMailSender(mailSender);
  }

  @Bean
  public JavaMailSender getJavaOrderMailSender()
  {
    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    mailSender.setUsername("orders@treecreate.dk");
    return configureJavaMailSender(mailSender);
  }

  private JavaMailSender configureJavaMailSender(JavaMailSenderImpl mailSender)
  {
    mailSender.setHost(mailServerHost);
    mailSender.setPort(mailServerPort);
    mailSender.setPassword(mailServerPassword);

    Properties props = mailSender.getJavaMailProperties();
    props.put("mail.transport.protocol", "smtp");
    props.put("mail.smtp.auth", mailServerAuth);
    props.put("mail.smtp.starttls.enable", mailServerStartTls);
    props.put("mail.debug", "false");

    return mailSender;
  }
}
