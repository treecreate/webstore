package dk.treecreate.api.authentication;

import dk.treecreate.api.authentication.dto.request.LoginRequest;
import dk.treecreate.api.authentication.dto.request.SignupRequest;
import dk.treecreate.api.authentication.dto.response.JwtResponse;
import dk.treecreate.api.authentication.jwt.JwtUtils;
import dk.treecreate.api.authentication.models.ERole;
import dk.treecreate.api.authentication.models.Role;
import dk.treecreate.api.authentication.repository.RoleRepository;
import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.authentication.services.UserDetailsImpl;
import dk.treecreate.api.authentication.services.UserDetailsServiceImpl;
import dk.treecreate.api.mail.MailService;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import dk.treecreate.api.utils.LocaleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("auth")
@Api(tags = {"Authentication"})
public class AuthController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    private static final String ROLE_NOT_FOUND_ERROR_MESSAGE = "Error: Role is not found.";
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    AuthUserService authUserService;
    @Autowired
    UserDetailsServiceImpl userDetailsService;
    @Autowired
    MailService mailService;
    @Autowired
    private LocaleService localeService;

    @PostMapping("/signin")
    @Operation(summary = "Sign in as an existing user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "User information including the access token",
            response = JwtResponse.class),
        @ApiResponse(code = 400, message = "Provided body is invalid or it is missing"),
        @ApiResponse(code = 401, message = "The login credentials are invalid")})
    public ResponseEntity<JwtResponse> authenticateUser(
        @Valid @RequestBody LoginRequest loginRequest,
        @Parameter(name = "eventLogUserId",
            description = "Event userId of not logged in user, to be replaced with logged in user id",
            example = "c0a80121-7ac0-190b-817a-c08ab0a12345") @RequestParam(
            required = false) UUID eventLogUserId)
    {
        return ResponseEntity.ok(authUserService
            .authenticateUser(loginRequest.getEmail(), loginRequest.getPassword(), eventLogUserId));
    }

    @PostMapping("/signup")
    @Operation(summary = "Register a new user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Information about the newly created user",
            response = JwtResponse.class),
        @ApiResponse(code = 401,
            message = "Provided body is not valid, it is missing, or the email is already in use")})
    public ResponseEntity<JwtResponse> registerUser(
        @Valid @RequestBody SignupRequest signUpRequest,
        @Parameter(name = "sendPasswordEmail",
            description = "Boolean to determine user being created on order")
        @RequestParam(required = false, defaultValue = "false") boolean sendPasswordEmail,
        @Parameter(name = "eventLogUserId",
            description = "Event userId of not logged in user, to be replaced with logged in user id",
            example = "c0a80121-7ac0-190b-817a-c08ab0a12345") @RequestParam(
            required = false) UUID eventLogUserId)
    {
        if (userRepository.existsByEmail(signUpRequest.getEmail()))
        {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User(signUpRequest.getEmail(), // for simplicity, the username is the email
            signUpRequest.getEmail(),
            encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = new HashSet<>();

        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
            .orElseThrow(() -> new RuntimeException(ROLE_NOT_FOUND_ERROR_MESSAGE));
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);

        try
        {
            if (sendPasswordEmail)
            {
                mailService.sendSignupEmailOnOrder(user.getEmail(), user.getToken(),
                    localeService.getLocale(null));
            } else
            {
                mailService.sendSignupEmail(user.getEmail(), localeService.getLocale(null));
            }
        } catch (Exception e)
        {
            LOGGER.error("Failed to process a signup email", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to send the email. Try again later");
        }

        return ResponseEntity.ok(authUserService
            .authenticateUser(signUpRequest.getEmail(), signUpRequest.getPassword(),
                eventLogUserId));
    }

    /**
     * Refreshes the user's pair of tokens by generating a new set of
     * <code>accessToken</code> and
     * <code>refreshToken</code>, and invalidating the old pair.
     *
     * @param request an HTTP request.
     * @return a <code>JwtResponse</code> containing the new user information.
     */
    @GetMapping("/refresh")
    @Operation(summary = "Refresh a user's tokens and invalidates the old ones.")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Refreshed user's tokens."),
        @ApiResponse(code = 500, message = "Failed to refresh the tokens.")})
    public JwtResponse refreshToken(
        HttpServletRequest request)
    {
        try
        {
            // Extract refresh token from request.
            String token = jwtUtils.parseJwt(request);
            String username = jwtUtils.getUserNameFromJwtToken(token);

            UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService
                .loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

            // Remove the old pair of tokens from the whitelist.
            jwtUtils.removeWhitelistJwtPair(token);

            // Generate a new set of tokens for the user.
            String accessToken = jwtUtils.generateJwtToken(authentication);
            String refreshToken = jwtUtils.generateJwtRefreshToken(authentication);

            // Whitelist the new pair of tokens.
            jwtUtils.whitelistJwtPair(accessToken, refreshToken);

            return new JwtResponse(accessToken,
                refreshToken,
                userDetails.getUsedId(),
                userDetails.getEmail(),
                userDetails.getIsVerified(),
                roles);
        } catch (Exception e)
        {
            LOGGER.error("Failed to refresh the authentication token.", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to refresh the authentication token. Try again later.");
        }
    }

    /**
     * Logs out the user by taking the token from the <code>Authorization</code>
     * header,
     * extracting the username from its body, and invalidating all of the tokens
     * that
     * belong to that user.
     *
     * @param request an HTTP request.
     * @return a <code>Response Entity</code> with no body.
     */
    @GetMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Logout a user and invalidate all previous tokens")
    @ApiResponses(value = {
        @ApiResponse(code = 204, message = "Invalidated user's tokens."),
        @ApiResponse(code = 500, message = "Failed to logout.")})
    public void logout(HttpServletRequest request)
    {
        try
        {
            // Extract refresh token from request.
            String token = jwtUtils.parseJwt(request);
            String user = jwtUtils.getUserNameFromJwtToken(token);

            // Remove all User's tokens from the whitelist
            jwtUtils.removeWhitelistUser(user);
        } catch (Exception e)
        {
            LOGGER.error("Failed to logout.", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to logout. Try again later.");
        }
    }

}
