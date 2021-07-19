package dk.treecreate.api.authentication;

import com.fasterxml.jackson.databind.ObjectMapper;
import dk.treecreate.api.authentication.dto.request.LoginRequest;
import dk.treecreate.api.authentication.models.ERole;
import dk.treecreate.api.authentication.models.Role;
import dk.treecreate.api.authentication.models.User;
import dk.treecreate.api.authentication.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import static org.hamcrest.CoreMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTests
{
    @Autowired
    private MockMvc mvc;

    @MockBean
    private UserRepository userRepository;

    @Test
    @DisplayName("/auth/signin endpoint correctly authenticates the bitch")
    void signinCorrectlySignsInUser() throws Exception
    {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("test@treecreate.dk");
        loginRequest.setPassword("abcDEF123");

        User user = new User();
        user.setUserId(UUID.fromString("c0a80121-7ab6-1787-817a-b69966240000"));
        user.setEmail(loginRequest.getEmail());
        user.setUsername(loginRequest.getEmail());
        user.setPassword(
            "$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62"); // hashed version of "abcDEF123"
        Set<Role> roles = new HashSet<>();
        roles.add(new Role(ERole.ROLE_USER));
        user.setRoles(roles);

        Mockito.when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(
            java.util.Optional.of(user));

        mvc.perform(post("/auth/signin")
            .contentType(MediaType.APPLICATION_JSON)
            .content(asJsonString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("userId", is(user.getUserId().toString())))
            .andExpect(jsonPath("email", is(user.getEmail())))
            .andExpect(jsonPath("roles", hasItem(ERole.ROLE_USER.toString())))
            .andExpect(jsonPath("tokenType", is("Bearer")))
            .andExpect(jsonPath("accessToken", is(notNullValue())));
    }

    public static String asJsonString(final Object obj)
    {
        try
        {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e)
        {
            throw new RuntimeException(e);
        }
    }
}
