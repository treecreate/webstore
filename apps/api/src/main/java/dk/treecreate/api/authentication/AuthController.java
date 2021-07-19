package dk.treecreate.api.authentication;

import dk.treecreate.api.authentication.dto.request.LoginRequest;
import dk.treecreate.api.authentication.dto.request.SignupRequest;
import dk.treecreate.api.authentication.dto.response.JwtResponse;
import dk.treecreate.api.authentication.dto.response.RegisterUserSuccessfulResponse;
import dk.treecreate.api.authentication.jwt.JwtUtils;
import dk.treecreate.api.authentication.models.ERole;
import dk.treecreate.api.authentication.models.Role;
import dk.treecreate.api.authentication.models.User;
import dk.treecreate.api.authentication.repository.RoleRepository;
import dk.treecreate.api.authentication.repository.UserRepository;
import dk.treecreate.api.authentication.services.UserDetailsImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("auth")
@Api(tags = {"Authentication"})
public class AuthController
{
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

    @PostMapping("/signin")
    @Operation(summary = "Sign in as an existing user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "User information including the access token",
            response = JwtResponse.class),
        @ApiResponse(code = 400, message = "Provided body is invalid or it is missing"),
        @ApiResponse(code = 401, message = "The login credentials are invalid")})
    public ResponseEntity<JwtResponse> authenticateUser(
        @Valid @RequestBody LoginRequest loginRequest)
    {

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
            userDetails.getUsedId(),
            userDetails.getEmail(),
            roles));
    }

    @PostMapping("/signup")
    @Operation(summary = "Register a new user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Information about the newly created user",
            response = RegisterUserSuccessfulResponse.class),
        @ApiResponse(code = 401,
            message = "Provided body is not valid, it is missing, or the email is already in use")})
    public ResponseEntity<RegisterUserSuccessfulResponse> registerUser(
        @Valid @RequestBody SignupRequest signUpRequest)
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

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null)
        {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException(ROLE_NOT_FOUND_ERROR_MESSAGE));
            roles.add(userRole);
        } else
        {
            strRoles.forEach(role -> {
                switch (role)
                {
                    case "ROLE_ADMIN":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException(ROLE_NOT_FOUND_ERROR_MESSAGE));
                        roles.add(adminRole);

                        break;
                    case "ROLE_DEVELOPER":
                        Role developerRole = roleRepository.findByName(ERole.ROLE_DEVELOPER)
                            .orElseThrow(() -> new RuntimeException(ROLE_NOT_FOUND_ERROR_MESSAGE));
                        roles.add(developerRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException(ROLE_NOT_FOUND_ERROR_MESSAGE));
                        roles.add(userRole);
                }
            });
        }
        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity
            .ok(new RegisterUserSuccessfulResponse(user.getUserId(), user.getEmail(),
                user.getRoles()));
    }
}
