package dk.treecreate.api.users;

import dk.treecreate.api.TestUtilsService;
import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.mail.MailService;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import dk.treecreate.api.user.UserService;
import dk.treecreate.api.user.dto.UpdateUserRequest;
import dk.treecreate.api.utils.LocaleService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTests
{

    @Autowired
    UserService userService;
    @MockBean
    AuthUserService authUserService;
    @Autowired
    private MockMvc mvc;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private MailService mailService;
    @MockBean
    private LocaleService localeService;

    @Nested
    class AuthenticationTests
    {

        @Test
        @DisplayName("GET /users endpoint returns 401 when user credentials are invalid")
        void getUsersReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            mvc.perform(get("/users"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("GET /users/:userId endpoint returns 401 when user credentials are invalid")
        void getUserReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(get("/users/" + uuid))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("PUT /users/:userId endpoint returns 401 when user credentials are invalid")
        void updateUserReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(put("/users/" + uuid))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("PUT /users endpoint returns 401 when user credentials are invalid")
        void updateCurrentUserReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            mvc.perform(put("/users"))
                .andExpect(status().isUnauthorized());
        }


        @Test
        @DisplayName("DELETE /users/:userId endpoint returns 401 when user credentials are invalid")
        void deleteUserReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(delete("/users/" + uuid))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName(
            "GET /users/verification endpoint returns 401 when user credentials are invalid")
        void sendVerificationEmailReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            mvc.perform(delete("/users/verification"))
                .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    class GetUsersTests
    {
        @Test
        @DisplayName("GET /users endpoint returns 403: Forbidden when called by ROLE_USER")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getUsersReturnsForbiddenToRoleUser() throws Exception
        {
            mvc.perform(get("/users"))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("GET /users endpoint returns a list of users")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void getUsersReturnsListOfUsers() throws Exception
        {
            List<User> userList = new ArrayList<>();
            userList.add(new User());
            userList.get(0).setEmail("example0@hotdeals.dev");
            userList.add(new User());
            userList.get(1).setEmail("example1@hotdeals.dev");

            Mockito.when(userRepository.findAll()).thenReturn(userList);

            mvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(userList)));
        }
    }

    @Nested
    class GetUserTests
    {

        @Test
        @DisplayName("GET /users/:userId endpoint returns 403: Forbidden when called by ROLE_USER")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getUserReturnsForbiddenToRoleUser() throws Exception
        {
            mvc.perform(get("/users/" + new UUID(0, 0)))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("GET /user endpoint returns a user")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void getUserReturnsUser() throws Exception
        {
            UUID userId = new UUID(0, 0);
            User user = new User();
            user.setUserId(userId);

            Mockito.when(userRepository.findByUserId(userId)).thenReturn(Optional.of(user));

            mvc.perform(get("/users/" + userId))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(user)));
        }

        @Test
        @DisplayName("GET /users/me endpoint returns currently authenticated user")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getCurrentUserReturnsUser() throws Exception
        {
            User user = new User();
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());

            Mockito.when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
            Mockito.when(authUserService.getCurrentlyAuthenticatedUser())
                .thenReturn(user);
            mvc.perform(get("/users/me"))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(user)));
        }
    }

    @Nested
    class UpdateUserTests
    {
        @Test
        @DisplayName("PUT /users/:userId endpoint returns 403: Forbidden when called by ROLE_USER")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void putUserReturnsForbiddenToRoleUser() throws Exception
        {
            mvc.perform(put("/users/" + new UUID(0, 0)))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName(
            "PUT /users endpoint returns updated version of the currently authenticated user")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void updateCurrentUserReturnsUpdatedUser() throws Exception
        {
            User user = new User();
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            UpdateUserRequest updateUserRequest = new UpdateUserRequest();
            updateUserRequest.setName("test user");
            user.setName(updateUserRequest.getName());

            Mockito.when(userRepository.existsByEmail(user.getEmail())).thenReturn(false);
            Mockito.when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
            Mockito.when(authUserService.getCurrentlyAuthenticatedUser())
                .thenReturn(user);
            Mockito.when(userRepository.save(user)).thenReturn(user);

            mvc.perform(put("/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtilsService.asJsonString(updateUserRequest)))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(user)));
        }

        @Test
        @DisplayName("PUT /users/:userId endpoint returns an updated user")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void updateUserReturnsUpdatedUser() throws Exception
        {
            UUID userId = new UUID(0, 0);
            User user = new User();
            user.setUserId(userId);
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            UpdateUserRequest updateUserRequest = new UpdateUserRequest();
            updateUserRequest.setName("test user");
            user.setName(updateUserRequest.getName());

            Mockito.when(userRepository.findByUserId(user.getUserId()))
                .thenReturn(Optional.of(user));
            Mockito.when(userRepository.existsByEmail(user.getEmail())).thenReturn(false);
            Mockito.when(userRepository.save(user)).thenReturn(user);

            mvc.perform(put("/users/" + userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtilsService.asJsonString(updateUserRequest)))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(user)));
        }

        @Test
        @DisplayName("PUT /users/:userId endpoint returns 400: Bad Request on invalid email")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void updateUserWithInvalidEmailReturnsBadRequest() throws Exception
        {
            User user = new User();
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            UpdateUserRequest updateUserRequest = new UpdateUserRequest();
            updateUserRequest.setEmail("invalid format");

            mvc.perform(put("/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtilsService.asJsonString(updateUserRequest)))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("PUT /users/:userId endpoint returns 400: Bad Request on duplicate email")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void updateUserWithDuplicateEmailReturnsBadRequest() throws Exception
        {
            UUID userId = new UUID(0, 0);
            User user = new User();
            user.setUserId(userId);
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            user.setPassword("testPassword");
            UpdateUserRequest updateUserRequest = new UpdateUserRequest();
            updateUserRequest.setEmail("notUnique@hotdeals.dev");

            Mockito.when(userRepository.findByUserId(user.getUserId()))
                .thenReturn(Optional.of(user));
            Mockito.when(userRepository.existsByEmail(updateUserRequest.getEmail()))
                .thenReturn(true);

            mvc.perform(put("/users/" + userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtilsService.asJsonString(updateUserRequest)))
                .andExpect(status().isBadRequest());
        }

        // I don't test all fields because I'm lazy
        @Test
        @DisplayName("PUT /users/:userId endpoint returns 400: Bad Request on invalid entry")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void updateUserWithTooLongEntryReturnsBadRequest()
            throws Exception
        {
            UUID userId = new UUID(0, 0);
            UpdateUserRequest updateUserRequest = new UpdateUserRequest();
            updateUserRequest.setPhoneNumber("12345678901234567890"); // the limit is 15

            mvc.perform(put("/users/" + userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtilsService.asJsonString(updateUserRequest)))
                .andExpect(status().isBadRequest());
        }
    }

    @Nested
    class DeleteUserTests
    {
        @Test
        @DisplayName(
            "DELETE /users/:userId endpoint returns 403: Forbidden when called by ROLE_USER")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void deleteUserReturnsForbiddenToRoleUser() throws Exception
        {
            mvc.perform(delete("/users/" + new UUID(0, 0)))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("DELETE /users/:userId endpoint returns 204: No Content when deleting a user")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void updateUserWithTooLongEntryReturnsBadRequest()
            throws Exception
        {
            UUID userId = new UUID(0, 0);
            User user = new User();
            user.setUserId(userId);
            Mockito.when(userRepository.findByUserId(userId)).thenReturn(Optional.of(user));
            Mockito.doNothing().when(userRepository).delete(user);

            mvc.perform(delete("/users/" + userId))
                .andExpect(status().isNoContent());
        }
    }

    @Nested
    class UserVerificationTests
    {
        @Test
        @DisplayName(
            "GET /users/verification/email/me endpoint returns 204: No Content when successfully sending a verification email")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void sendVerificationEmailReturnsNoContent() throws Exception
        {
            User user = new User();
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());

            Mockito.when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
            Mockito.when(authUserService.getCurrentlyAuthenticatedUser())
                .thenReturn(user);
            Mockito.when(localeService.getLocale(any())).thenReturn(new Locale("dk"));
            Mockito.doNothing().when(mailService)
                .sendVerificationEmail(anyString(), any(UUID.class), any(Locale.class));
            mvc.perform(get("/users/verification/email/me"))
                .andExpect(status().isNoContent());
        }

        @Test
        @DisplayName(
            "GET /users/verification/:token endpoint returns 404: Not Found if the token doesn't match any user")
        void verifyUserWithIncorrectTokenReturnsNotFound() throws Exception
        {
            UUID token = UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235");

            Mockito.when(userRepository.findByToken(token)).thenReturn(Optional.empty());
            mvc.perform(get("/users/verification/" + token))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName(
            "GET /users/verification/:token endpoint returns 403: Forbidden if the user is already verified")
        void verifyUserThatIsAlreadyVerifiedReturnsBadRequest() throws Exception
        {
            UUID token = UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235");
            User user = new User();
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            user.setToken(token);
            user.setIsVerified(true);

            Mockito.when(userRepository.findByToken(token)).thenReturn(Optional.of(user));
            mvc.perform(get("/users/verification/" + token))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName(
            "GET /users/verification/:token endpoint returns 200: OK and updates users isVerified status")
        void verifyUserCorrectlyUpdatesUser() throws Exception
        {
            UUID token = UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235");
            User user = new User();
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            user.setToken(token);
            user.setIsVerified(false);

            Mockito.when(userRepository.findByToken(token)).thenReturn(Optional.of(user));
            Mockito.when(userRepository.save(user)).thenReturn(user);
            mvc.perform(get("/users/verification/" + token))
                .andExpect(status().isNoContent());
        }
    }
}
