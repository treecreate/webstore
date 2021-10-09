package dk.treecreate.api.users;

import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.mail.MailService;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import dk.treecreate.api.user.UserService;
import dk.treecreate.api.user.dto.UpdateUserRequest;
import dk.treecreate.api.utils.LocaleService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.server.ResponseStatusException;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.Locale;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class UserServiceTests
{
    @Autowired
    UserService userService;

    @MockBean
    AuthUserService authUserService;

    @MockBean
    UserRepository userRepository;
    @MockBean
    MailService mailService;

    @Test
    void updatesUserCorrectly() throws MessagingException, UnsupportedEncodingException
    {
        User user = new User();
        User baseUser = new User();
        var updateUserRequest = new UpdateUserRequest();
        baseUser.setUserId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234"));
        baseUser.setToken(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235"));
        baseUser.setPassword(authUserService.encodePassword("basePassword"));
        baseUser.setEmail("base@hotdeals.dev");
        baseUser.setUsername(baseUser.getEmail());
        baseUser.setName("base baseUser");
        baseUser.setPhoneNumber("00110011");
        baseUser.setStreetAddress("basegade");
        baseUser.setStreetAddress2("basic floor");
        baseUser.setPostcode("0000");
        baseUser.setCity("baseende");
        baseUser.setCountry("baseland");
        updateUserRequest.setEmail("test@hotdeals.dev");
        updateUserRequest.setPassword("testPassword321");
        updateUserRequest.setName("test user");
        updateUserRequest.setPhoneNumber("12345678");
        updateUserRequest.setStreetAddress("testgade");
        updateUserRequest.setStreetAddress2("1B2C3D");
        updateUserRequest.setPostcode("1234");
        updateUserRequest.setCity("testende");
        updateUserRequest.setCountry("testland");

        user.setUserId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234"));
        user.setToken(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235"));
        user.setPassword("encodedUpdatedPassword"); // the authService is mocked
        user.setEmail("test@hotdeals.dev");
        user.setUsername(user.getEmail());
        user.setName("test user");
        user.setPhoneNumber("12345678");
        user.setStreetAddress("testgade");
        user.setStreetAddress2("1B2C3D");
        user.setPostcode("1234");
        user.setCity("testende");
        user.setCountry("testland");

        // make sure that the encoded password matches what we set
        Mockito.when(authUserService.encodePassword(updateUserRequest.getPassword()))
            .thenReturn("encodedUpdatedPassword");

        assertEquals(user, userService.updateUser(updateUserRequest, baseUser));
    }

    @Test
    void updatesUserCorrectlyWithNullValuesPresent()
        throws MessagingException, UnsupportedEncodingException
    {
        User user = new User();
        User baseUser = new User();
        var updateUserRequest = new UpdateUserRequest();
        baseUser.setUserId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234"));
        baseUser.setToken(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235"));
        baseUser.setPassword("");
        baseUser.setEmail("base@hotdeals.dev");
        baseUser.setUsername(baseUser.getEmail());
        baseUser.setName("base baseUser");
        baseUser.setPhoneNumber("00110011");
        baseUser.setStreetAddress("basegade");
        baseUser.setStreetAddress2("basic floor");
        baseUser.setPostcode("0000");
        baseUser.setCity("baseende");
        baseUser.setCountry("baseland");
        user.setUserId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234"));
        user.setToken(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235"));
        user.setPassword("");
        user.setEmail("base@hotdeals.dev");
        user.setUsername(user.getEmail());
        user.setName("base baseUser");
        user.setPhoneNumber("00110011");
        user.setStreetAddress("basegade");
        user.setStreetAddress2("basic floor");
        user.setPostcode("0000");
        user.setCity("baseende");
        user.setCountry("baseland");

        assertEquals(user, userService.updateUser(updateUserRequest, baseUser));
    }

    @Test
    void throwsBadRequestOnDuplicateEmail()
    {
        User baseUser = new User();
        var updateUserRequest = new UpdateUserRequest();
        baseUser.setUserId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234"));
        baseUser.setToken(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235"));
        baseUser.setPassword("");
        baseUser.setEmail("base@hotdeals.dev");
        baseUser.setUsername(baseUser.getEmail());
        baseUser.setName("base baseUser");
        baseUser.setPhoneNumber("00110011");
        baseUser.setStreetAddress("basegade");
        baseUser.setStreetAddress2("basic floor");
        baseUser.setPostcode("0000");
        baseUser.setCity("baseende");
        baseUser.setCountry("baseland");
        updateUserRequest.setEmail("test@hotdeals.dev");
        updateUserRequest.setName("test user");
        updateUserRequest.setPhoneNumber("12345678");
        updateUserRequest.setStreetAddress("testgade");
        updateUserRequest.setStreetAddress2("1B2C3D");
        updateUserRequest.setPostcode("1234");
        updateUserRequest.setCity("testende");
        updateUserRequest.setCountry("testland");

        Mockito.when(userRepository.existsByEmail(updateUserRequest.getEmail())).thenReturn(true);

        assertThrows(ResponseStatusException.class, () ->
            userService.updateUser(updateUserRequest, baseUser));
    }

    @Test
    void updatesUserCorrectlyIfEmailMatchesUserEmail()
        throws MessagingException, UnsupportedEncodingException
    {
        User baseUser = new User();
        User user = new User();
        var updateUserRequest = new UpdateUserRequest();
        baseUser.setUserId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234"));
        baseUser.setToken(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235"));
        baseUser.setPassword("");
        baseUser.setEmail("base@hotdeals.dev");
        baseUser.setUsername(baseUser.getEmail());
        updateUserRequest.setEmail("base@hotdeals.dev");
        user.setUserId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234"));
        user.setToken(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235"));
        user.setPassword("");
        user.setEmail("base@hotdeals.dev");
        user.setUsername(user.getEmail());

        Mockito.when(userRepository.existsByEmail(updateUserRequest.getEmail())).thenReturn(true);

        assertEquals(user, userService.updateUser(updateUserRequest, baseUser));
    }

    @Test
    void changeUserVerificationStatusWhenEmailGetsUpdated()
        throws MessagingException, UnsupportedEncodingException
    {
        User baseUser = new User();
        User user = new User();
        var updateUserRequest = new UpdateUserRequest();
        baseUser.setUserId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234"));
        baseUser.setToken(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235"));
        baseUser.setEmail("base@hotdeals.dev");
        baseUser.setUsername(baseUser.getEmail());
        baseUser.setIsVerified(true);
        updateUserRequest.setEmail("new@hotdeals.dev");
        user.setUserId(baseUser.getUserId());
        user.setToken(baseUser.getToken());
        user.setPassword("");
        user.setEmail("new@hotdeals.dev");
        user.setUsername(user.getEmail());
        user.setIsVerified(false);

        Mockito.when(userRepository.existsByEmail(updateUserRequest.getEmail())).thenReturn(false);
        Mockito.when(LocaleService.getLocale(null)).thenReturn(new Locale("dk"));
        Mockito.doNothing().when(mailService)
            .sendVerificationEmail(user.getEmail(), user.getToken().toString(), new Locale("dk"));

        assertEquals(user, userService.updateUser(updateUserRequest, baseUser));
    }


    @Test
    void dontChangeUserVerificationStatusWhenEmailIsTheSame()
        throws MessagingException, UnsupportedEncodingException
    {
        User baseUser = new User();
        User user = new User();
        var updateUserRequest = new UpdateUserRequest();
        baseUser.setUserId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234"));
        baseUser.setToken(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235"));
        baseUser.setEmail("base@hotdeals.dev");
        baseUser.setUsername(baseUser.getEmail());
        baseUser.setIsVerified(true);
        updateUserRequest.setEmail("base@hotdeals.dev");
        user.setUserId(baseUser.getUserId());
        user.setToken(baseUser.getToken());
        user.setPassword("");
        user.setEmail("base@hotdeals.dev");
        user.setUsername(user.getEmail());
        user.setIsVerified(true);

        Mockito.when(userRepository.existsByEmail(updateUserRequest.getEmail())).thenReturn(false);
        Mockito.when(LocaleService.getLocale(null)).thenReturn(new Locale("dk"));
        Mockito.doNothing().when(mailService)
            .sendVerificationEmail(user.getEmail(), user.getToken().toString(), new Locale("dk"));

        assertEquals(user, userService.updateUser(updateUserRequest, baseUser));
    }
}
