package dk.treecreate.api.feedback;

import dk.treecreate.api.feedback.dto.CreateFeedbackRequest;
import dk.treecreate.api.mail.MailService;
import io.sentry.Sentry;
import io.swagger.annotations.Api;
import io.swagger.v3.oas.annotations.Operation;
import java.io.UnsupportedEncodingException;
import javax.mail.MessagingException;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@CrossOrigin(origins = "*", maxAge = 3600)
@Api(tags = {"Feedback"})
@RequestMapping("feedback")
public class FeedbackController {
  @Autowired MailService mailService;

  @PostMapping("")
  @ResponseStatus(HttpStatus.ACCEPTED)
  @Operation(summary = "Create a feedback entry")
  public void registerfeedback(@RequestBody(required = true) @Valid CreateFeedbackRequest request)
      throws UnsupportedEncodingException, MessagingException {
    this.mailService.sendFeedbackEmail(request);
    Sentry.setExtra("description", request.getDescription());
    Sentry.captureMessage("New feedback has been registered");
  }
}
