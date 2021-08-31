package dk.treecreate.api.newsletter;

import dk.treecreate.api.TestUtilsService;
import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.user.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class NewsletterControllerTests
{

    @MockBean
    AuthUserService authUserService;
    @Autowired
    private MockMvc mvc;
    @MockBean
    private NewsletterRepository newsletterRepository;

    @Nested
    class AuthenticationTests
    {

        @Test
        @DisplayName("GET /newsletter endpoint returns 401 when user credentials are invalid")
        void getNewslettersReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            mvc.perform(get("/newsletter"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName(
            "GET /newsletter/:newsletterId endpoint returns 401 when user credentials are invalid")
        void getNewsletterReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(get("/newsletter/" + uuid))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("GET /newsletter/me endpoint returns 401 when user credentials are invalid")
        void getNewsLetterOfUserReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            mvc.perform(get("/newsletter/me"))
                .andExpect(status().isUnauthorized());
        }

    }

    @Nested
    class GetNewslettersTests
    {
        @Test
        @DisplayName("GET /newsletter endpoint returns 403: Forbidden when called by ROLE_USER")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getNewslettersReturnsForbiddenToRoleUser() throws Exception
        {
            mvc.perform(get("/newsletter"))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("GET /newsletter endpoint returns a list of newsletters")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void getNewslettersReturnsListOfUsers() throws Exception
        {
            List<Newsletter> list = new ArrayList<>();
            list.add(new Newsletter());
            list.get(0).setEmail("example0@hotdeals.dev");
            list.add(new Newsletter());
            list.get(1).setEmail("example1@hotdeals.dev");

            Mockito.when(newsletterRepository.findAll()).thenReturn(list);

            mvc.perform(get("/newsletter"))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(list)));
        }
    }

    @Nested
    class GetNewsletterTests
    {

        @Test
        @DisplayName(
            "GET /newsletter/:email endpoint returns 403: Forbidden when called by ROLE_USER")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getNewsletterReturnsForbiddenToRoleUser() throws Exception
        {
            Newsletter newsletter = new Newsletter();
            newsletter.setEmail("example@hotdeals.dev");
            mvc.perform(get("/newsletter/" + newsletter.getEmail()))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("GET /newsletter endpoint returns a Newsletter")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void getNewsletterReturnsNewsletter() throws Exception
        {
            Newsletter newsletter = new Newsletter();
            newsletter.setEmail("example@hotdeals.dev");

            Mockito.when(newsletterRepository.findByEmail(newsletter.getEmail()))
                .thenReturn(Optional.of(newsletter));

            mvc.perform(get("/newsletter/" + newsletter.getEmail()))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(newsletter)));
        }

        @Test
        @DisplayName(
            "GET /newsletter/me endpoint returns a newsletter associated with currently authenticated user")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getAssociatedNewsletterReturnsNewsletter() throws Exception
        {
            User user = new User();
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());

            Newsletter newsletter = new Newsletter();
            newsletter.setEmail(user.getEmail());

            Mockito.when(newsletterRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(newsletter));
            Mockito.when(authUserService.getCurrentlyAuthenticatedUser())
                .thenReturn(user);
            mvc.perform(get("/newsletter/me"))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(newsletter)));
        }
    }

    @Nested
    class CreateNewsletterTests
    {
        @Test
        @DisplayName("POST /newsletter/:email endpoint returns a newsletter")
        void createNewsletterReturnsNewsletter() throws Exception
        {
            Newsletter newsletter = new Newsletter();
            newsletter.setNewsletterId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235"));
            newsletter.setEmail("example@hotdeals.dev");


            Mockito.when(newsletterRepository.existsByEmail(newsletter.getEmail()))
                .thenReturn(false);
            Mockito.when(newsletterRepository.save(newsletter))
                .thenReturn((newsletter));

            mvc.perform(post("/newsletter/" + newsletter.getEmail()))
                .andExpect(status().isOk());
        }


        @Test
        @DisplayName("POST /newsletter/:email retuns 400: Bad Request on duplicate email entry")
        void createNewsletterReturnsBadRequestOnDuplicate() throws Exception
        {
            Newsletter newsletter = new Newsletter();
            newsletter.setEmail("example@hotdeals.dev");

            Mockito.when(newsletterRepository.existsByEmail(newsletter.getEmail()))
                .thenReturn(true);

            mvc.perform(post("/newsletter/" + newsletter.getEmail()))
                .andExpect(status().isBadRequest());
        }
    }

    @Nested
    class DeleteNewsletterTests
    {

        @Test
        @DisplayName(
            "DELETE /newsletter/:newsletterId endpoint returns 204: No Content when deleting a newsletter")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void deleteNewsletterReturnsNewsletter()
            throws Exception
        {
            Newsletter newsletter = new Newsletter();
            newsletter.setNewsletterId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235"));

            Mockito.when(newsletterRepository.findByNewsletterId(newsletter.getNewsletterId()))
                .thenReturn(Optional.of(newsletter));
            Mockito.doNothing().when(newsletterRepository).delete(newsletter);

            mvc.perform(delete("/newsletter/" + newsletter.getNewsletterId()))
                .andExpect(status().isNoContent());
        }
    }
}
