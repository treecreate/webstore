package dk.treecreate.api.designs;

import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.user.UserRepository;
import dk.treecreate.api.user.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class DesignControllerTests
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
    private DesignRepository designRepository;


    @Nested
    class AuthenticationTests
    {

        @Test
        @DisplayName("GET /designs endpoint returns 401 when user credentials are invalid")
        void getDesignsReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            mvc.perform(get("/designs"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("GET /designs endpoint returns 401 when user without Developer or Admin role tries tto access it")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getDesignsReturnsForbiddenOnMIssingRole() throws Exception
        {
            mvc.perform(get("/designs"))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName(
            "GET /designs/:userId endpoint returns 401 when user credentials are invalid")
        void getDesignsOfUserReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(get("/designs/" + uuid))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName(
            "GET /designs/:userId endpoint returns 403 when user without Developer or Admin role tries tto access it")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getDesignsOfUserReturnsForbiddenOnMissingRole() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(get("/designs/" + uuid))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName(
            "POST /designs/:designId endpoint returns 401 when user credentials are invalid")
        void getDesignReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(post("/designs/" + uuid))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName(
            "POST /designs/:designId endpoint returns 403 when user without Developer or Admin role tries tto access it")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getDesignReturnsForbiddenOnMissingRole() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(post("/designs/" + uuid))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("GET /designs/me endpoint returns 401 when user credentials are invalid")
        void getDesignsOfCurrentUserReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            mvc.perform(get("/designs/me"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName(
            "GET /designs/me/:designId endpoint returns 401 when user credentials are invalid")
        void getSpecificDesignOfCurrentUserReturnsUnauthorizedOnInvalidCredentials()
            throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(get("/designs/me/" + uuid))
                .andExpect(status().isUnauthorized());
        }


        @Test
        @DisplayName("POST /designs endpoint returns 401 when user credentials are invalid")
        void createReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(post("/designs/" + uuid))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName(
            "PUT /designs/:designId endpoint returns 401 when user credentials are invalid")
        void updateReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(put("/designs/" + uuid))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName(
            "DELETE /designs/:designId endpoint returns 401 when user credentials are invalid")
        void deleteReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(delete("/designs/" + uuid))
                .andExpect(status().isUnauthorized());
        }
    }

}
