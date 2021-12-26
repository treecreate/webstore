package dk.treecreate.api.authentication.jwt;

import dk.treecreate.api.config.CustomPropertiesConfig;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class JwtUtilsTest
{

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    CustomPropertiesConfig customProperties;

    @Test
    void parseJwt()
    {
        // untestable due to relicance on complex springboot beans
    }

    @Test
    void generateJwtToken()
    {
        // untestable due to relicance on complex springboot beans
    }

    @Test
    void generateJwtRefreshToken()
    {
        // untestable due to relicance on complex springboot beans
    }

    @Test
    void getUserNameFromJwtToken()
    {
        String token = Jwts.builder()
            .setIssuedAt(new Date())
            .setExpiration(new Date(new Date().getTime() + 60000))
            .setSubject("test@example.com")
            .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
            .compact();
        assertEquals(jwtUtils.getUserNameFromJwtToken(token), "test@example.com");
    }

    @Nested
    class ValidateJwtTokenTests
    {
        @Test
        @DisplayName("Should return true for a valid, whitelisted token")
        void validateJwtTrue()
        {
            String token = Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 60000))
                .setSubject("test@example.com")
                .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
                .compact();
            jwtUtils.whitelistJwtPair(token, token);
            assertTrue(jwtUtils.validateJwtToken(token));
        }

        @Test
        @DisplayName("Should return false for a valid but not whitelisted token")
        void validateJwtFalseNotWhitelisted()
        {
            String token = Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 60000))
                .setSubject("test@example.com")
                .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
                .compact();
            assertFalse(jwtUtils.validateJwtToken(token));
        }

        @Test
        @DisplayName("Should return false for an expired token")
        void validateJwtFalseExpired()
        {
            String token = Jwts.builder()
                .setIssuedAt(new Date(new Date().getTime() - 600000))
                .setExpiration(new Date(new Date().getTime() - 60000))
                .setSubject("test@example.com")
                .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
                .compact();
            assertFalse(jwtUtils.validateJwtToken(token));
        }
    }

    @Nested
    class GetJwtTTLTest
    {
        @Test
        @DisplayName("Returns the JWT time until expiration")
        void getJwtTTL()
        {
            String token = Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(
                    new Date((new Date()).getTime() + 1000))
                .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
                .compact();
            assertEquals(1, jwtUtils.getJwtTTL(token));
        }

        @Test
        @DisplayName("GetJwtTTL throws ExpiredJwtException expired token")
        void getTtlThrowsExpiredJwtExceptionForExpiredToken()
        {
            String token = Jwts.builder()
                .setIssuedAt(new Date(new Date().getTime() - 20000))
                .setExpiration(new Date(new Date().getTime() - 4000))
                .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
                .compact();
            assertThrows(ExpiredJwtException.class, () -> {
                jwtUtils.getJwtTTL(token);
            });
        }
    }

    @Nested
    class IsWhitelistedTest
    {
        @Test
        @DisplayName("Returns true for a whitelisted token")
        void isWhiteListedReturnsTrue()
        {
            String token = Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 60000))
                .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
                .compact();
            jwtUtils.whitelistJwtPair(token, token);
            assertTrue(jwtUtils.isWhitelisted(token));
        }

        @Test
        @DisplayName("Returns false for a not whitelisted token")
        void isWhiteListedReturnsFalse()
        {
            String token = Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 60000))
                .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
                .compact();
            jwtUtils.removeWhitelistJwtPair(token);
            assertFalse(jwtUtils.isWhitelisted(token));
        }
    }

    @Test
    @DisplayName("Whitelisting a token should add it to the whitelist")
    void whitelistJwtPair()
    {
        String token = Jwts.builder()
            .setIssuedAt(new Date())
            .setExpiration(new Date(new Date().getTime() + 60000))
            .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
            .compact();
        jwtUtils.whitelistJwtPair(token, token);
        assertTrue(jwtUtils.isWhitelisted(token));
    }

    @Test
    void removeWhitelistJwtPair()
    {
        String token = Jwts.builder()
            .setIssuedAt(new Date())
            .setExpiration(new Date(new Date().getTime() + 60000))
            .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
            .compact();
        jwtUtils.whitelistJwtPair(token, token);
        assertTrue(jwtUtils.isWhitelisted(token));
        jwtUtils.removeWhitelistJwtPair(token);
        assertFalse(jwtUtils.isWhitelisted(token));
    }

    @Test
    void removeWhitelistUser()
    {
        String token = Jwts.builder()
            .setIssuedAt(new Date())
            .setExpiration(new Date(new Date().getTime() + 60000))
            .setSubject("test@example.com")
            .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
            .compact();
        jwtUtils.whitelistJwtPair(token, token);
        assertTrue(jwtUtils.isWhitelisted(token));
        jwtUtils.removeWhitelistUser("test@example.com");
        assertFalse(jwtUtils.isWhitelisted(token));
    }
}
