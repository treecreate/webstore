package dk.treecreate.api.authentication.jwt;

import dk.treecreate.api.authentication.services.UserDetailsImpl;
import dk.treecreate.api.config.CustomPropertiesConfig;
import io.jsonwebtoken.*;
import net.jodah.expiringmap.ExpiringMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;

@Component
public class JwtUtils
{
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Autowired
    CustomPropertiesConfig customProperties;

    private ExpiringMap<String, String> blacklist;

    @Autowired
    public JwtUtils() {
        this.blacklist = ExpiringMap.builder()
            .variableExpiration()
            .maxSize(1000)
            .build();
    }

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

    /**
     * Generates and returns a new refresh token for an authenticated user.
     * 
     * @param authentication
     * @return a String representing the refresh token generated for the user.
     */
    public String generateJwtRefreshToken(Authentication authentication)
    {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
            .setSubject(userPrincipal.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + customProperties.getJwtRefreshExpirationMs()))
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
            return !isBlacklisted(authToken);
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

    /**
     * Gets the Time-To-Live of the provided token.
     * 
     * @param token a JWT.
     * @return <code>long</code> amount of seconds left until the token expires; <code>0</code> if the token is already expired.
     */
    public long getJwtTTL(String token) {
        Date expirationDate = Jwts.parser().setSigningKey(customProperties.getJwtSecret()).parseClaimsJws(token)
            .getBody().getExpiration();
        long expirationSecond = expirationDate.toInstant().getEpochSecond();
        long currentSecond = Instant.now().getEpochSecond();

        return Math.max(0, expirationSecond - currentSecond);
    }

    /**
     * Adds the provided JWT to the blacklist until it expires.
     * The blacklist entry will have the token as its <code>key</code> and the
     * username as the <code>value</code>.
     * 
     * The time unit used is <code>seconds</code>.
     * 
     * @param token the JWT to be blacklisted.
     */
    public void blacklistJwt(String token) {
        String username = getUserNameFromJwtToken(token);
        long ttl = getJwtTTL(token);

        blacklist.put(token, username, ttl, TimeUnit.SECONDS);
    }

    /**
     * Checks if the provided token is blacklisted or not.
     * 
     * @param token a JWT.
     * @return <code>true</code> if token is blacklisted and <code>false</code> if it isn't.
     */
    public boolean isBlacklisted(String token) {
        return blacklist.containsKey(token);
    }
}
