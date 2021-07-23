package dk.treecreate.api.authentication.services;

import dk.treecreate.api.authentication.dto.response.JwtResponse;
import dk.treecreate.api.authentication.jwt.JwtUtils;
import dk.treecreate.api.authentication.repository.RoleRepository;
import dk.treecreate.api.authentication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public JwtResponse authenticateUser(final String email, final String password)
    {

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email,
                password));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        return new JwtResponse(jwt,
            userDetails.getUsedId(),
            userDetails.getEmail(),
            roles);
    }
}
