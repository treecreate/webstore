package dk.treecreate.api.user;

import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import dk.treecreate.api.mail.MailService;
import dk.treecreate.api.user.dto.GetUsersResponse;
import dk.treecreate.api.user.dto.UpdateUserRequest;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("users")
@Api(tags = {"Users"})
public class UserController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;
    @Autowired
    AuthUserService authUserService;
    @Autowired
    MailService mailService;

    @GetMapping()
    @Operation(summary = "Get all users")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "A list of users",
            response = GetUsersResponse.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public List<User> getUsers()
    {
        return userRepository.findAll();
    }

    @GetMapping("{userId}")
    @Operation(summary = "Get a user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "User information",
            response = User.class),
        @ApiResponse(code = 404, message = "User not found")})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public User getUser(
        @ApiParam(name = "userId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID userId)
    {
        return userRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @PutMapping("{userId}")
    @Operation(summary = "Update a user as a developer/admin")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "User information",
            response = User.class),
        @ApiResponse(code = 404, message = "User not found")
    })
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public User updateUser(
        @ApiParam(name = "userId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID userId,
        @RequestBody(required = false) @Valid UpdateUserRequest updateUserRequest)
        throws MessagingException, UnsupportedEncodingException
    {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (updateUserRequest == null) return user;
        return userRepository.save(userService.updateUser(updateUserRequest, user));
    }

    @PutMapping()
    @Operation(summary = "Update the currently authenticated user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "User information",
            response = User.class),
        @ApiResponse(code = 404, message = "User not found")
    })
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public User updateCurrentUser(
        @RequestBody(required = false) @Valid UpdateUserRequest updateUserRequest)
        throws MessagingException, UnsupportedEncodingException
    {
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (updateUserRequest == null) return user;
        return userRepository.save(userService.updateUser(updateUserRequest, user));
    }

    @DeleteMapping("{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Get all users")
    @ApiResponses(value = {
        @ApiResponse(code = 204, message = "A list of users",
            response = GetUsersResponse.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public void deleteUser(
        @ApiParam(name = "userId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID userId)
    {

        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
    }

    @GetMapping("me")
    @Operation(summary = "Get currently authenticated user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "User information",
            response = User.class),
        @ApiResponse(code = 404, message = "User not found")
    })
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public User getCurrentUser()
    {
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        return userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Operation(summary = "Send a verification email for the currently authenticated user")
    @ApiResponses(value = {
        @ApiResponse(code = 204, message = "Email sent successfully"),
        @ApiResponse(code = 404, message = "User not found")
    })
    @GetMapping("verification")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public void sendVerificationEmailForCurrentUser(@Parameter(name = "lang",
        description = "Language of the email. Defaults to danish (dk)." +
            "\nValid values: 'en', 'dk'", example = "en") @RequestParam(required = false)
                                                        String lang)
    {
        User user = authUserService.getCurrentlyAuthenticatedUser();
        try
        {
            mailService.sendVerificationEmail(user.getEmail(), user.getToken().toString(),
                mailService.getLocale(lang));
        } catch (Exception e)
        {
            LOGGER.error("Failed to process a verification email", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to send the email. Try again later");
        }
    }

    @Operation(summary = "Verify a user with specified token")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @ApiResponses(value = {
        @ApiResponse(code = 204, message = "User has been verified"),
        @ApiResponse(code = 400, message = "User is already verified"),
        @ApiResponse(code = 404, message = "User with associated token not found")
    })
    @GetMapping("verification/{token}")
    public void sendVerificationEmailForCurrentUser(
        @ApiParam(name = "token", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @Valid @PathVariable UUID token)
    {
        User user = userRepository.findByToken(token)
            .orElseThrow(
                () -> new ResourceNotFoundException("User with specified token not found"));
        if (user.getIsVerified() != null && user.getIsVerified())
        {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is already verified");
        }
        user.setIsVerified(true);
        userRepository.save(user);
    }
}
