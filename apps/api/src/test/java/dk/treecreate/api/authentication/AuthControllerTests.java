package dk.treecreate.api.authentication;

import dk.treecreate.api.TestUtilsService;
import dk.treecreate.api.authentication.dto.request.LoginRequest;
import dk.treecreate.api.authentication.dto.request.SignupRequest;
import dk.treecreate.api.authentication.models.ERole;
import dk.treecreate.api.authentication.models.Role;
import dk.treecreate.api.authentication.repository.RoleRepository;
import dk.treecreate.api.mail.MailService;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import dk.treecreate.api.utils.LocaleService;
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
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.Matchers.hasSize;
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
    @MockBean
    private RoleRepository roleRepository;
    @MockBean
    private MailService mailService;
    @MockBean
    private LocaleService localeService;

    // region Signin

    @Test
    @DisplayName("/auth/signin endpoint return 400 when the request body is incorrect")
    void signinReturnsBadRequestOnInvalidBody() throws Exception
    {
        mvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("/auth/signin endpoint return 401 when user credentials are invalid")
    void signinReturnsUnauthorizedOnInvalidCredentials() throws Exception
    {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@treecreate.dk");
        loginRequest.setPassword("abcDEF1234");

        User user = new User();
        user.setUserId(UUID.fromString("c0a80121-7ab6-1787-817a-b69966240000"));
        user.setEmail(loginRequest.getEmail());
        user.setUsername(loginRequest.getEmail());
        // hashed version of "abcDEF123", which is different from the user password in this test
        user.setPassword(
            "$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62");
        Set<Role> roles = new HashSet<>();
        roles.add(new Role(ERole.ROLE_USER));
        user.setRoles(roles);

        Mockito.when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(
            java.util.Optional.of(user));

        mvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtilsService.asJsonString(loginRequest)))
            .andExpect(status().isUnauthorized());
    }

    //endregion

    //region Sign Up

    @Test
    @DisplayName("/auth/signin endpoint correctly authenticates the user")
    void signinCorrectlySignsInUser() throws Exception
    {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@treecreate.dk");
        loginRequest.setPassword("abcDEF123");

        User user = new User();
        user.setUserId(UUID.fromString("c0a80121-7ab6-1787-817a-b69966240000"));
        user.setEmail(loginRequest.getEmail());
        user.setUsername(loginRequest.getEmail());
        user.setIsVerified(true);
        user.setPassword(
            "$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62"); // hashed version of "abcDEF123"
        Set<Role> roles = new HashSet<>();
        roles.add(new Role(ERole.ROLE_USER));
        user.setRoles(roles);

        Mockito.when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(
            java.util.Optional.of(user));

        mvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtilsService.asJsonString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("userId", is(user.getUserId().toString())))
            .andExpect(jsonPath("email", is(user.getEmail())))
            .andExpect(jsonPath("isVerified", is(user.getIsVerified())))
            .andExpect(jsonPath("roles", hasItem(ERole.ROLE_USER.toString())))
            .andExpect(jsonPath("tokenType", is("Bearer")))
            .andExpect(jsonPath("accessToken", is(notNullValue())));
    }

    @Test
    @DisplayName("/auth/signup endpoint return 400 when the request body is incorrect")
    void signupReturnsBadRequestOnInvalidBody() throws Exception
    {
        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("/auth/signup endpoint return 400 when user email ios already taken")
    void signupReturnsBadRequestWhenUserEmailIsTaken() throws Exception
    {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@treecreate.dk");
        signupRequest.setPassword("abcDEF123");

        Mockito.when(userRepository.existsByEmail(signupRequest.getEmail())).thenReturn(true);

        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtilsService.asJsonString(signupRequest)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("/auth/signup endpoint correctly creates a new user")
    void signupCorrectlyCreatesNewUser() throws Exception
    {
        Set<Role> roles = new HashSet<>();
        roles.add(new Role(ERole.ROLE_USER));

        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@treecreate.dk");
        signupRequest.setPassword("abcDEF123");
        User user = new User();
        user.setUserId(UUID.fromString("c0a80121-7ab6-1787-817a-b69966240000"));
        user.setUserId(UUID.fromString("c0a80121-7ab6-1787-817a-b69966240000"));
        user.setEmail(signupRequest.getEmail());
        user.setUsername(signupRequest.getEmail());
        user.setPassword(
            "$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62"); // hashed version of "abcDEF123"
        user.setRoles(roles);

        Mockito.when(userRepository.save(user)).thenReturn(user);
        Mockito.when(userRepository.findByEmail(signupRequest.getEmail())).thenReturn(
            java.util.Optional.of(user));
        Mockito.when(roleRepository.findByName(ERole.ROLE_USER)).thenReturn(
            java.util.Optional.of(new Role(ERole.ROLE_USER)));
        Mockito.when(localeService.getLocale(null)).thenReturn(new Locale("dk"));
        Mockito.doNothing().when(mailService)
            .sendSignupEmail(user.getEmail(), user.getToken().toString(), new Locale("dk"));

        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtilsService.asJsonString(signupRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("userId", is(user.getUserId().toString())))
            .andExpect(jsonPath("email", is(user.getEmail())))
            .andExpect(jsonPath("$.roles", hasSize(1)))
            .andExpect(jsonPath("tokenType", is("Bearer")))
            .andExpect(jsonPath("accessToken", is(notNullValue())));
    }
    //endregion

    @Test
    @DisplayName("/auth/signup endpoint correctly creates a new user with specified roles")
    void signupCorrectlyCreatesNewUserWithSpecifiedRoles() throws Exception
    {
        Set<Role> roles = new HashSet<>();
        roles.add(new Role(ERole.ROLE_USER));
        roles.add(new Role(ERole.ROLE_DEVELOPER));
        roles.add(new Role(ERole.ROLE_ADMIN));

        Set<String> strRoles = new HashSet<>();
        strRoles.add("ROLE_USER");
        strRoles.add("ROLE_DEVELOPER");
        strRoles.add("ROLE_ADMIN");

        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@treecreate.dk");
        signupRequest.setPassword("abcDEF123");
        signupRequest.setRoles(strRoles);

        User user = new User();
        user.setUserId(UUID.fromString("c0a80121-7ab6-1787-817a-b69966240000"));
        user.setEmail(signupRequest.getEmail());
        user.setUsername(signupRequest.getEmail());
        user.setPassword(
            "$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62"); // hashed version of "abcDEF123"
        user.setRoles(roles);

        Mockito.when(userRepository.save(user)).thenReturn(user);
        Mockito.when(userRepository.findByEmail(signupRequest.getEmail())).thenReturn(
            java.util.Optional.of(user));
        Mockito.when(roleRepository.findByName(ERole.ROLE_USER)).thenReturn(
            java.util.Optional.of(new Role(ERole.ROLE_USER)));
        Mockito.when(roleRepository.findByName(ERole.ROLE_DEVELOPER)).thenReturn(
            java.util.Optional.of(new Role(ERole.ROLE_DEVELOPER)));
        Mockito.when(roleRepository.findByName(ERole.ROLE_ADMIN)).thenReturn(
            java.util.Optional.of(new Role(ERole.ROLE_ADMIN)));

        Mockito.when(localeService.getLocale(null)).thenReturn(new Locale("dk"));
        Mockito.doNothing().when(mailService)
            .sendVerificationEmail(user.getEmail(), user.getToken().toString(), new Locale("dk"));

        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtilsService.asJsonString(signupRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("userId", is(user.getUserId().toString())))
            .andExpect(jsonPath("email", is(user.getEmail())))
            .andExpect(jsonPath("$.roles", hasSize(3)))
            .andExpect(jsonPath("tokenType", is("Bearer")))
            .andExpect(jsonPath("accessToken", is(notNullValue())));
    }
}
