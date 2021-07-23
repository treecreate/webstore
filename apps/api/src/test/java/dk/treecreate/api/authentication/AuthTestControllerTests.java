package dk.treecreate.api.authentication;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class AuthTestControllerTests
{
    @Autowired
    private MockMvc mvc;

    @Test
    @DisplayName("/auth/test/all endpoint returns correct data without authentication")
    void allReturnsCorrectDataWithoutAuth() throws Exception
    {
        mvc.perform(get("/auth/test/all")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().string("Public Content."));
    }

    @Test
    @DisplayName("/auth/test/user without being authenticated gets denied (Unauthorized)")
    void userReturnsUnauthorizedToUnauthorizedUsers() throws Exception
    {
        mvc.perform(get("/auth/test/user")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("/auth/test/user when authenticated returns correct data")
    @WithMockUser(username = "test@treecreate.dk", password = "testPassword",
        roles = {"USER", "DEVELOPER", "ADMIN"})
    void userReturnsCorrectDataForAuthenticatedUsers() throws Exception
    {
        mvc.perform(get("/auth/test/user")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().string("User Content."));
    }

    @Test
    @DisplayName("/auth/test/developer without being authenticated gets denied (Unauthorized)")
    void developerReturnsUnauthorizedToUnauthenticatedUsers() throws Exception
    {
        mvc.perform(get("/auth/test/developer")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("/auth/test/developer without the developer role gets denied (Forbidden)")
    @WithMockUser(username = "test@treecreate.dk", password = "testPassword",
        roles = {"USER", "ADMIN"})
    void developerReturnsForbiddenToUnauthorizedUsers() throws Exception
    {
        mvc.perform(get("/auth/test/developer")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }


    @Test
    @DisplayName("/auth/test/developer when authenticated returns correct data")
    @WithMockUser(username = "test@treecreate.dk", password = "testPassword",
        roles = {"DEVELOPER"})
    void developerReturnsCorrectDataForAuthenticatedUsers() throws Exception
    {
        mvc.perform(get("/auth/test/developer")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().string("Developer Board."));
    }

    // Because of how MockMvc and security work, failed requests return 200 with an empty body. ¯\_(ツ)_/¯
    @Test
    @DisplayName("/auth/test/admin without being authenticated gets denied (Unauthorized)")
    void adminReturnsUnauthorizedToUnauthenticatedUsers() throws Exception
    {
        mvc.perform(get("/auth/test/admin")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized());
    }


    // Because of how MockMvc and security work, failed requests return 200 with an empty body. ¯\_(ツ)_/¯
    @Test
    @DisplayName("/auth/test/admin without the admin role gets denied (Forbidden)")
    @WithMockUser(username = "test@treecreate.dk", password = "testPassword",
        roles = {"USER", "DEVELOPER"})
    void adminReturnsForbiddenToUnauthorizedUsers() throws Exception
    {
        mvc.perform(get("/auth/test/admin")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("/auth/test/admin when authenticated returns correct data")
    @WithMockUser(username = "test@treecreate.dk", password = "testPassword",
        roles = {"ADMIN"})
    void adminReturnsCorrectDataForAuthenticatedUsers() throws Exception
    {
        mvc.perform(get("/auth/test/admin")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().string("Admin Board."));
    }

}
