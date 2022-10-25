package dk.treecreate.api.mail;

import dk.treecreate.api.config.CustomPropertiesConfig;
import dk.treecreate.api.order.Order;
import dk.treecreate.api.order.OrderService;
import dk.treecreate.api.order.dto.CreateCustomOrderRequest;
import dk.treecreate.api.utils.LinkService;
import dk.treecreate.api.utils.QuickpayService;
import io.sentry.Sentry;
import java.io.File;
import java.io.FileInputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class MailService {
  private final TemplateEngine templateEngine;

  private final JavaMailSender infoMailSender;
  private final JavaMailSender orderMailSender;

  private static final Logger LOGGER = LoggerFactory.getLogger(MailService.class);

  @Autowired LinkService linkService;
  @Autowired OrderService orderService;
  @Autowired CustomPropertiesConfig customPropertiesConfig;
  @Autowired QuickpayService quickpayService;

  public MailService(
      TemplateEngine templateEngine,
      @Qualifier("getJavaInfoMailSender") JavaMailSender infoMailSender,
      @Qualifier("getJavaOrderMailSender") JavaMailSender orderMailSender) {
    this.templateEngine = templateEngine;
    this.infoMailSender = infoMailSender;
    this.orderMailSender = orderMailSender;
  }

  public void sendSignupEmail(String to, Locale locale)
      throws UnsupportedEncodingException, MessagingException {
    Context context = new Context(locale);
    context.setVariable("email", to);
    String subject =
        locale.getLanguage().equals("da") ? "Velkomment til Treecreate" : "Welcome to Treecreate";
    sendMail(to, MailDomain.INFO, subject, context, MailTemplate.SIGNUP);
  }

  public void sendSignupEmailOnOrder(String to, UUID token, Locale locale)
      throws UnsupportedEncodingException, MessagingException {
    Context context = new Context(locale);
    context.setVariable("email", to);
    context.setVariable("resetPasswordLink", linkService.generateResetPasswordLink(token, locale));
    String subject =
        locale.getLanguage().equals("da") ? "Velkomment til Treecreate" : "Welcome to Treecreate";
    sendMail(to, MailDomain.INFO, subject, context, MailTemplate.SIGNUP_ON_ORDER);
  }

  public void sendNewsletterDiscountEmail(
      String to, Locale locale, String unsubscribeNewsletterUrl, String discountCode)
      throws UnsupportedEncodingException, MessagingException {
    Context context = new Context(locale);
    context.setVariable("email", to);
    context.setVariable("unsubscribeNewsletterUrl", unsubscribeNewsletterUrl);
    context.setVariable("discountCode", discountCode);
    String subject =
        locale.getLanguage().equals("da")
            ? "Her er din rabatkode - Team Treecreate!"
            : "Here's your discount - Team Treecreate!";
    // Add the marketing pdf to the email
    List<MultipartFile> attachmentsList = new ArrayList<>();
    try {
      File pdf =
          new File(getClass().getResource("/assets/pdf/Top_10_julegaveideer_2022.pdf").getFile());
      FileItem fileItem =
          new DiskFileItem(
              "mainFile",
              Files.probeContentType(pdf.toPath()),
              false,
              pdf.getName(),
              (int) pdf.length(),
              pdf.getParentFile());
      IOUtils.copy(new FileInputStream(pdf), fileItem.getOutputStream());
      MultipartFile multipartFile = new CommonsMultipartFile(fileItem);
      attachmentsList.add(multipartFile);
    } catch (Exception e) {
      LOGGER.error("Failed to attach the marketing pdf to the newsletter signup email", e);
      Sentry.captureException(e);
    }
    sendMail(
        to, MailDomain.INFO, subject, context, MailTemplate.NEWSLETTER_DISCOUNT, attachmentsList);
  }

  public void sendResetPasswordEmail(String to, UUID token, Locale locale)
      throws UnsupportedEncodingException, MessagingException {
    Context context = new Context(locale);
    context.setVariable("email", to);
    context.setVariable("resetPasswordLink", linkService.generateResetPasswordLink(token, locale));
    String subject = locale.getLanguage().equals("da") ? "Skift kodeord" : "Reset password";
    sendMail(to, MailDomain.INFO, subject, context, MailTemplate.RESET_PASSWORD);
  }

  public void sendOrderConfirmationEmail(String to, Order order)
      throws UnsupportedEncodingException, MessagingException {
    // Calculate the total (subtotal + discount) before the delivery price
    BigDecimal calculatedTotal = order.getTotal();
    switch (order.getShippingMethod()) {
      case PICK_UP_POINT: // delivery price is either 0 or 25
        {
          BigDecimal substratedTotal = order.getTotal().subtract(new BigDecimal(25));
          if (substratedTotal.compareTo(new BigDecimal(350)) <= 0) {
            calculatedTotal = substratedTotal;
          }
          break;
        }
      case HOME_DELIVERY: // delivery price is either 25 or 65
        {
          BigDecimal substratedTotal = order.getTotal().subtract(new BigDecimal(65));
          if (substratedTotal.compareTo(new BigDecimal(350)) <= 0) {
            calculatedTotal = substratedTotal;
          } else {
            calculatedTotal = order.getTotal().subtract(new BigDecimal(25));
          }
          break;
        }

      case OWN_DELIVERY:
        {
          calculatedTotal = order.getTotal().subtract(new BigDecimal(100));
          break;
        }
    }
    // Calculate delivery price. Calulcations return total + delivery price, so we
    // substract the
    // total
    BigDecimal deliveryPrice =
        orderService
            .calculateDeliveryPrice(order.getShippingMethod(), calculatedTotal)
            .subtract(calculatedTotal);
    // Set Variables
    Context context = new Context(new Locale("da"));
    context.setVariable("email", to);
    context.setVariable("order", order);
    context.setVariable("deliveryPrice", deliveryPrice);
    String subject = "Treecreate - Order Confirmation";

    sendMail(
        to,
        MailDomain.INFO,
        subject,
        context,
        MailTemplate.ORDER_CONFIRMATION,
        customPropertiesConfig.getTrustpilotAFSEmail());
    sendMail(
        MailDomain.ORDER.label, MailDomain.INFO, subject, context, MailTemplate.ORDER_CONFIRMATION);
  }

  public void sendCustomOrderRequestEmail(CreateCustomOrderRequest orderInfo)
      throws UnsupportedEncodingException, MessagingException {
    Context context = new Context(Locale.ENGLISH);
    context.setVariable("order", orderInfo);
    String subject = "Custom order request";
    sendMail(
        MailDomain.INFO.label,
        MailDomain.INFO,
        subject,
        context,
        MailTemplate.CUSTOM_ORDER_REQUEST,
        orderInfo.getImages());
  }

  public void sendOrderPaymentReminderEmail(Order order, String recipient) throws Exception {
    String subject = "Your Treecreate order is waiting for your payment!";
    Context context = new Context(Locale.ENGLISH);
    context.setVariable("payment-link", quickpayService.getPaymentLink(order.getPaymentId()));
    sendMail(
        order.getContactInfo().getEmail(),
        MailDomain.INFO,
        subject,
        context,
        MailTemplate.PAYMENT_REMINDER);
  }

  // No BCC email and no attachments
  private void sendMail(
      String to, MailDomain from, String subject, Context context, MailTemplate template)
      throws MessagingException, UnsupportedEncodingException {
    sendMail(to, from, subject, context, template, null, new ArrayList<MultipartFile>());
  }

  // BCC Email included
  private void sendMail(
      String to,
      MailDomain from,
      String subject,
      Context context,
      MailTemplate template,
      String bccEmail)
      throws MessagingException, UnsupportedEncodingException {
    sendMail(to, from, subject, context, template, bccEmail, new ArrayList<MultipartFile>());
  }

  // No BCC email but there are attachments
  private void sendMail(
      String to,
      MailDomain from,
      String subject,
      Context context,
      MailTemplate template,
      List<MultipartFile> attachmentFiles)
      throws MessagingException, UnsupportedEncodingException {
    sendMail(to, from, subject, context, template, null, attachmentFiles);
  }

  private void sendMail(
      String to,
      MailDomain from,
      String subject,
      Context context,
      MailTemplate template,
      String bccEmail,
      List<MultipartFile> attachmentFiles)
      throws MessagingException, UnsupportedEncodingException {
    String process = templateEngine.process("emails/" + template.label, context);
    JavaMailSender mailSender = getMailSender(from);
    javax.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
    MimeMessageHelper helper =
        new MimeMessageHelper(
            mimeMessage,
            MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
            StandardCharsets.UTF_8.name());
    helper.setFrom(new InternetAddress(from.label, "Treecreate"));
    helper.setSubject(subject);
    helper.setText(process, true);
    helper.setTo(to);

    if (!attachmentFiles.isEmpty()) {
      for (MultipartFile file : attachmentFiles) {
        helper.addAttachment(file.getOriginalFilename(), file);
      }
    }
    if (bccEmail != null) {
      helper.addBcc(bccEmail);
    }
    mailSender.send(mimeMessage);
  }

  public boolean isValidEmail(String email) {
    // Java mail does not check for length
    if (email.length() > 255) return false;
    try {
      new InternetAddress(email).validate();
      return true;
    } catch (AddressException e) {
      return false;
    }
  }

  private JavaMailSender getMailSender(MailDomain mailDomain) {
    if (mailDomain == MailDomain.ORDER) {
      return orderMailSender;
    }
    return infoMailSender;
  }
}
