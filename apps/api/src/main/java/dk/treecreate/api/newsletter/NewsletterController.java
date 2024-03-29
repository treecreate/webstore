package dk.treecreate.api.newsletter;

import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import dk.treecreate.api.mail.MailService;
import dk.treecreate.api.newsletter.dto.GetNewslettersResponse;
import dk.treecreate.api.utils.LinkService;
import dk.treecreate.api.utils.LocaleService;
import io.sentry.Sentry;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.UUID;
import javax.mail.MessagingException;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Transactional
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("newsletter")
@Api(tags = {"newsletter"})
public class NewsletterController {
  @Autowired NewsletterRepository newsletterRepository;
  @Autowired NewsletterService newsletterService;
  @Autowired AuthUserService authUserService;
  @Autowired MailService mailService;
  @Autowired LinkService linkService;
  @Autowired private LocaleService localeService;

  @GetMapping()
  @Operation(summary = "Get all newsletters")
  @ApiResponses(
      value = {
        @ApiResponse(
            code = 200,
            message = "A list of newsletters",
            response = GetNewslettersResponse.class)
      })
  @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
  public List<Newsletter> getNewsletters() {
    return newsletterRepository.findAll();
  }

  @GetMapping("me")
  @Operation(
      summary = "Get a newsletter associated (via email) with the currently authenticated user")
  @ApiResponses(
      value = {
        @ApiResponse(code = 200, message = "Newsletter information", response = Newsletter.class),
        @ApiResponse(code = 404, message = "Newsletter not found")
      })
  @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
  public Newsletter getAssociatedNewsletter() {
    var userDetails = authUserService.getCurrentlyAuthenticatedUser();
    return newsletterRepository
        .findByEmail(userDetails.getEmail())
        .orElseThrow(() -> new ResourceNotFoundException("Newsletter not found"));
  }

  @GetMapping("{email}")
  @Operation(summary = "Get a newsletter")
  @ApiResponses(
      value = {
        @ApiResponse(code = 200, message = "Newsletter information", response = Newsletter.class),
        @ApiResponse(code = 404, message = "Newsletter not found")
      })
  @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
  public Newsletter getNewsletter(
      @ApiParam(name = "email", example = "example@hotdeals.dev") @PathVariable String email) {
    return newsletterRepository
        .findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("Newsletter not found"));
  }

  @PostMapping("{email}")
  @Operation(summary = "Create a new newsletter entry")
  @ApiResponses(
      value = {
        @ApiResponse(code = 200, message = "Newsletter information", response = Newsletter.class),
        @ApiResponse(code = 400, message = "Duplicate newsletter")
      })
  public Newsletter createNewsletter(
      @ApiParam(name = "email", example = "example@hotdeals.dev") @PathVariable String email,
      @Parameter(
              name = "lang",
              description =
                  "Language of the email. Defaults to danish (dk)." + "\nValid values: 'en', 'da'",
              example = "en")
          @RequestParam(required = false)
          String lang)
      throws MessagingException, UnsupportedEncodingException {
    if (newsletterRepository.existsByEmail(email)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already registered");
    }
    Newsletter newsletter = new Newsletter();
    newsletter.setEmail(email);
    Sentry.setExtra("email", newsletter.getEmail());
    Sentry.captureMessage("New newsletter entry");

    Newsletter createdNewsletter = newsletterRepository.save(newsletter);

    // Send intro letter with discount
    newsletterService.sendNewsletterDiscountEmail(email, lang, createdNewsletter.getNewsletterId());

    return newsletterRepository.save(newsletter);
  }

  @DeleteMapping("{newsletterId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Operation(summary = "Delete a newsletter entry")
  @ApiResponses(
      value = {
        @ApiResponse(code = 204, message = "Newsletter has been removed"),
        @ApiResponse(code = 404, message = "Newsletter not found")
      })
  public void deleteNewsletter(
      @ApiParam(name = "Newsletter ID", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
          @Valid
          @PathVariable
          UUID newsletterId) {
    Newsletter newsletter =
        newsletterRepository
            .findByNewsletterId(newsletterId)
            .orElseThrow(() -> new ResourceNotFoundException("Newsletter not found"));
    Sentry.setExtra("newsletterId", newsletter.getNewsletterId().toString());
    Sentry.setExtra("email", newsletter.getEmail());
    Sentry.captureMessage("Someone has unsubscribed from the newsletter");
    newsletterRepository.delete(newsletter);
  }
}
