package dk.treecreate.api.authentication.jwt;

import dk.treecreate.api.authentication.services.UserDetailsImpl;
import dk.treecreate.api.config.CustomPropertiesConfig;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils
{
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Autowired
    CustomPropertiesConfig customProperties;

    public String parseJwt(HttpServletRequest request)
    {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer "))
        {
            return headerAuth.substring(7);
        }

        return null;
    }

    public String generateJwtToken(Authentication authentication)
    {

        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
            .setSubject((userPrincipal.getUsername()))
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + customProperties.getJwtExpirationMs()))
            .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
            .compact();
    }

    public String getUserNameFromJwtToken(String token)
    {
        return Jwts.parser().setSigningKey(customProperties.getJwtSecret()).parseClaimsJws(token)
            .getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken)
    {
        try
        {
            Jwts.parser().setSigningKey(customProperties.getJwtSecret()).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e)
        {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e)
        {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e)
        {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e)
        {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e)
        {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }
}
