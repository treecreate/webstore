package dk.treecreate.api.mail;

import dk.treecreate.api.mail.dto.SignupDto;
import dk.treecreate.api.utils.LocaleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController()
@RequestMapping("mail")
@Api(tags = {"Sending out emails"})
public class MailController
{
    @Autowired
    MailService mailService;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @Operation(summary = "Send a signup email to the specified address")
    @ApiResponses(value = {
        @ApiResponse(code = 202, message = "Accepted"),
        @ApiResponse(code = 400, message = "Provided email is not a valid email"),
        @ApiResponse(code = 500, message = "Failed to send an email")})
    public void signup(
        @Parameter(name = "email", description = "An address that the email is to be sent to")
        @RequestBody SignupDto signupDto, @Parameter(name = "lang",
        description = "Language of the email. Defaults to danish (dk)." +
            "\nValid values: 'en', 'dk'", example = "en") @RequestParam(required = false)
            String lang)
    {

        if (!mailService.isValidEmail(signupDto.getEmail()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Provided email is not a valid email");

        try
        {
            mailService.sendSignupEmail(signupDto.getEmail(), UUID.randomUUID().toString(),
                LocaleService.getLocale(lang));
        } catch (Exception e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to send an email");
        }
    }

}
