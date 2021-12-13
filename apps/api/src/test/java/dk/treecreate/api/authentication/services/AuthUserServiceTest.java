package dk.treecreate.api.authentication.services;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthUserServiceTest
{

    @Autowired
    AuthUserService authUserService;

    // implicitly tested by majority of other integration tests that require authentication
    @Test
    void authenticateUser()
    {
    }


    // implicitly tested by majority of other integration tests that require authentication
    @Test
    void getCurrentlyAuthenticatedUser()
    {
    }

    @Test
    @DisplayName("Returns encoded password")
    void encodePassword()
    {
        String password = "abcDEF123";
        String encodedPassword = authUserService.encodePassword(password);
        assertNotEquals(encodedPassword, password);
        assertTrue(encodedPassword.startsWith("$2a$10"));
    }
}
