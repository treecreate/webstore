package dk.treecreate.api.authentication.services;

import dk.treecreate.api.authentication.dto.response.JwtResponse;
import dk.treecreate.api.authentication.jwt.JwtUtils;
import dk.treecreate.api.authentication.repository.RoleRepository;
import dk.treecreate.api.events.EventService;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthUserService
{
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
    private EventService eventService;

    public JwtResponse authenticateUser(final String email, final String password)
    {
        return authenticateUser(email, password, null);
    }

    public JwtResponse authenticateUser(final String email, final String password, UUID oldUserId)
    {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email,
                password));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        String jwtRefresh = jwtUtils.generateJwtRefreshToken(authentication);

        jwtUtils.whitelistJwtPair(jwt, jwtRefresh);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        if (oldUserId != null)
        {
            eventService.updateEventUserId(oldUserId, userDetails.getUsedId());
        }

        return new JwtResponse(jwt,
            jwtRefresh,
            userDetails.getUsedId(),
            userDetails.getEmail(),
            userDetails.getIsVerified(),
            roles);
    }

    public User getCurrentlyAuthenticatedUser()
    {
        var userDetails =
            (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public String encodePassword(String password)
    {
        return encoder.encode(password);
    }
}
