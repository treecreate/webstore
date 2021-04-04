package dk.treecreate.api.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;

@RestController
public class MailController
{
  @Autowired
  MailService mailService;

  @RequestMapping(value = "/mail", method = RequestMethod.POST)
  @ResponseBody
  public String sendMail(@RequestBody User user) throws MessagingException, UnsupportedEncodingException
  {
    mailService.sendMail(user, MailTemplate.RESET_PASSWORD);
    return "Email Sent Successfully.!";
  }
}
