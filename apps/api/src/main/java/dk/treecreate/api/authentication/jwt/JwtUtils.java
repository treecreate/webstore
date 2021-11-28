package dk.treecreate.api.authentication.jwt;

import dk.treecreate.api.authentication.services.UserDetailsImpl;
import dk.treecreate.api.config.CustomPropertiesConfig;
import io.jsonwebtoken.*;
import net.jodah.expiringmap.ExpiringMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Component
public class JwtUtils
{
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Autowired
    CustomPropertiesConfig customProperties;

    private ExpiringMap<String, String> whitelist;

    @Autowired
    public JwtUtils()
    {
        this.whitelist = ExpiringMap.builder()
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
            .setExpiration(
                new Date((new Date()).getTime() + customProperties.getJwtRefreshExpirationMs()))
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
            return isWhitelisted(authToken);
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
     * @return amount of seconds left until the token expires; <code>0</code> if the token is already expired.
     */
    public long getJwtTTL(String token)
    {
        Date expirationDate =
            Jwts.parser().setSigningKey(customProperties.getJwtSecret()).parseClaimsJws(token)
                .getBody().getExpiration();
        long expirationSecond = expirationDate.toInstant().getEpochSecond();
        long currentSecond = Instant.now().getEpochSecond();

        return Math.max(0, expirationSecond - currentSecond);
    }

    /**
     * Checks if the provided token is whitelisted or not.
     *
     * @param token a JWT.
     * @return <code>true</code> if token is whitelisted and <code>false</code> if it isn't.
     */
    public boolean isWhitelisted(String token)
    {
        return whitelist.containsKey(token) || whitelist.containsValue(token);
    }

    /**
     * Adds a token pair to the whitelist, where the key is the <code>refreshToken</code>
     * and the value is the <code>authToken</code>.
     * <p>
     * The entry's TTL is equal to the <code>refreshToken</code>'s TTL.
     *
     * @param authToken
     * @param refreshToken
     */
    public void whitelistJwtPair(String authToken, String refreshToken)
    {
        long ttl = getJwtTTL(refreshToken);
        whitelist.put(refreshToken, authToken, ttl, TimeUnit.SECONDS);
    }

    /**
     * Removes a token pair from the whitelist based on the provided token.
     * Provided token can be wither an <code>authToken</code>(value), or
     * <code>refreshToken</code>(key).
     *
     * @param token
     */
    public void removeWhitelistJwtPair(String token)
    {
        if (whitelist.containsKey(token))
        {
            // If the token is the refresh token
            whitelist.remove(token);
        } else if (whitelist.containsValue(token))
        {
            // If the token is the auth token
            whitelist.values().removeIf(value -> value.equals(token));
        }
    }

    /**
     * Removes all the access and refresh tokens for the given user.
     *
     * @param user user's username.
     */
    public void removeWhitelistUser(String user)
    {
        whitelist.keySet().removeIf(key -> getUserNameFromJwtToken(key).equals(user));
    }
}
