package dk.treecreate.api.authentication;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dk.treecreate.api.TestUtilsService;
import dk.treecreate.api.authentication.dto.request.LoginRequest;
import dk.treecreate.api.authentication.dto.request.SignupRequest;
import dk.treecreate.api.authentication.jwt.JwtUtils;
import dk.treecreate.api.authentication.models.ERole;
import dk.treecreate.api.authentication.models.Role;
import dk.treecreate.api.authentication.repository.RoleRepository;
import dk.treecreate.api.config.CustomPropertiesConfig;
import dk.treecreate.api.mail.MailService;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import dk.treecreate.api.utils.LocaleService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.*;
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

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTests {
  @Autowired private MockMvc mvc;
  @Autowired private CustomPropertiesConfig customProperties;

  @MockBean private UserRepository userRepository;
  @MockBean private RoleRepository roleRepository;
  @MockBean private MailService mailService;
  @MockBean private LocaleService localeService;

  @Nested
  class SigninTests {
    @Autowired private JwtUtils jwtUtils;

    @Test
    @DisplayName("/auth/signin endpoint return 400 when the request body is incorrect")
    void signinReturnsBadRequestOnInvalidBody() throws Exception {
      mvc.perform(post("/auth/signin").contentType(MediaType.APPLICATION_JSON))
          .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("/auth/signin endpoint return 401 when user credentials are invalid")
    void signinReturnsUnauthorizedOnInvalidCredentials() throws Exception {
      LoginRequest loginRequest = new LoginRequest();
      loginRequest.setEmail("test@treecreate.dk");
      loginRequest.setPassword("abcDEF1234");

      User user = new User();
      user.setUserId(UUID.fromString("c0a80121-7ab6-1787-817a-b69966240000"));
      user.setEmail(loginRequest.getEmail());
      user.setUsername(loginRequest.getEmail());
      // hashed version of "abcDEF123", which is different from the user password in this test
      user.setPassword("$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62");
      Set<Role> roles = new HashSet<>();
      roles.add(new Role(ERole.ROLE_USER));
      user.setRoles(roles);

      Mockito.when(userRepository.findByEmail(loginRequest.getEmail()))
          .thenReturn(java.util.Optional.of(user));

      mvc.perform(
              post("/auth/signin")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(TestUtilsService.asJsonString(loginRequest)))
          .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("/auth/signin endpoint correctly authenticates the user")
    void signinCorrectlySignsInUser() throws Exception {
      LoginRequest loginRequest = new LoginRequest();
      loginRequest.setEmail("test@treecreate.dk");
      loginRequest.setPassword("abcDEF123");

      User user = new User();
      user.setUserId(UUID.fromString("c0a80121-7ab6-1787-817a-b69966240000"));
      user.setEmail(loginRequest.getEmail());
      user.setUsername(loginRequest.getEmail());
      user.setIsVerified(true);
      user.setPassword(
          "$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62"); // hashed version of
      // "abcDEF123"
      Set<Role> roles = new HashSet<>();
      roles.add(new Role(ERole.ROLE_USER));
      user.setRoles(roles);

      Mockito.when(userRepository.findByEmail(loginRequest.getEmail()))
          .thenReturn(java.util.Optional.of(user));

      mvc.perform(
              post("/auth/signin")
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
  }

  @Nested
  class SignupTests {
    @Autowired private JwtUtils jwtUtils;

    @Test
    @DisplayName("/auth/signup endpoint return 400 when the request body is incorrect")
    void signupReturnsBadRequestOnInvalidBody() throws Exception {
      mvc.perform(post("/auth/signup").contentType(MediaType.APPLICATION_JSON))
          .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("/auth/signup endpoint return 400 when user email ios already taken")
    void signupReturnsBadRequestWhenUserEmailIsTaken() throws Exception {
      SignupRequest signupRequest = new SignupRequest();
      signupRequest.setEmail("test@treecreate.dk");
      signupRequest.setPassword("abcDEF123");

      Mockito.when(userRepository.existsByEmail(signupRequest.getEmail())).thenReturn(true);

      mvc.perform(
              post("/auth/signup")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(TestUtilsService.asJsonString(signupRequest)))
          .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("/auth/signup endpoint correctly creates a new user")
    void signupCorrectlyCreatesNewUser() throws Exception {
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
          "$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62"); // hashed version of
      // "abcDEF123"
      user.setRoles(roles);

      Mockito.when(userRepository.save(user)).thenReturn(user);
      Mockito.when(userRepository.findByEmail(signupRequest.getEmail()))
          .thenReturn(java.util.Optional.of(user));
      Mockito.when(roleRepository.findByName(ERole.ROLE_USER))
          .thenReturn(java.util.Optional.of(new Role(ERole.ROLE_USER)));
      Mockito.when(localeService.getLocale(null)).thenReturn(new Locale("da"));
      Mockito.doNothing().when(mailService).sendSignupEmail(user.getEmail(), new Locale("da"));

      mvc.perform(
              post("/auth/signup")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(TestUtilsService.asJsonString(signupRequest)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("userId", is(user.getUserId().toString())))
          .andExpect(jsonPath("email", is(user.getEmail())))
          .andExpect(jsonPath("$.roles", hasSize(1)))
          .andExpect(jsonPath("tokenType", is("Bearer")))
          .andExpect(jsonPath("accessToken", is(notNullValue())));
    }
  }

  @Nested
  class RefreshTokenTests {

    @MockBean private JwtUtils jwtUtils;

    @Test
    @DisplayName("/auth/refresh endpoint returns 401 when user is not authenticated")
    void refreshReturnsUnauthorizedOnInvalidCredentials() throws Exception {
      mvc.perform(get("/auth/refresh")).andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test@treecreate.dk")
    @DisplayName("/auth/refresh endpoint correctly refreshes the user's tokens")
    void refreshCorrectlyRefreshesTokens() throws Exception {
      User user = new User();
      user.setUserId(UUID.fromString("c0a80121-7ab6-1787-817a-b69966240000"));
      user.setEmail("test@treecreate.dk");
      user.setUsername(user.getEmail());
      // hashed version of "abcDEF123", which is different from the user password in this test
      user.setPassword("$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62");
      Set<Role> roles = new HashSet<>();
      roles.add(new Role(ERole.ROLE_USER));
      user.setRoles(roles);

      String refreshToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtRefreshExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      String authToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      String newRefreshToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtRefreshExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      String newAuthToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      Mockito.when(userRepository.findByEmail(user.getEmail()))
          .thenReturn(java.util.Optional.of(user));
      Mockito.when(jwtUtils.generateJwtToken(any())).thenReturn(newAuthToken);
      Mockito.when(jwtUtils.generateJwtRefreshToken(any())).thenReturn(newRefreshToken);

      jwtUtils.whitelistJwtPair(authToken, refreshToken);

      mvc.perform(
              get("/auth/refresh")
                  .contentType(MediaType.APPLICATION_JSON)
                  .header("Authorization", "Bearer " + refreshToken))
          .andExpect(status().isOk())
          .andExpect(jsonPath("tokenType", is("Bearer")))
          .andExpect(jsonPath("accessToken", equalTo(newAuthToken)))
          .andExpect(jsonPath("refreshToken", equalTo(newRefreshToken)));
    }

    @Test
    @WithMockUser(username = "test@treecreate.dk")
    @DisplayName("/auth/refresh endpoint correctly invalidates old tokens")
    void refreshCorrectlyInvalidatesOldTokens() throws Exception {
      User user = new User();
      user.setUserId(UUID.fromString("c0a80121-7ab6-1787-817a-b69966240000"));
      user.setEmail("test@treecreate.dk");
      user.setUsername(user.getEmail());
      // hashed version of "abcDEF123", which is different from the user password in this test
      user.setPassword("$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62");
      Set<Role> roles = new HashSet<>();
      roles.add(new Role(ERole.ROLE_USER));
      user.setRoles(roles);

      String refreshToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtRefreshExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      String authToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      String newRefreshToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtRefreshExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      String newAuthToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      Mockito.when(userRepository.findByEmail(user.getEmail()))
          .thenReturn(java.util.Optional.of(user));
      Mockito.when(jwtUtils.generateJwtToken(any())).thenReturn(newAuthToken);
      Mockito.when(jwtUtils.generateJwtRefreshToken(any())).thenReturn(newRefreshToken);

      jwtUtils.whitelistJwtPair(authToken, refreshToken);

      mvc.perform(
              get("/auth/refresh")
                  .contentType(MediaType.APPLICATION_JSON)
                  .header("Authorization", "Bearer " + refreshToken))
          .andExpect(status().isOk());

      assertFalse(jwtUtils.validateJwtToken(authToken));
      assertFalse(jwtUtils.validateJwtToken(refreshToken));
    }
  }

  @Nested
  class LogoutTests {
    @Autowired private JwtUtils jwtUtils;

    @Test
    @DisplayName("/auth/logout endpoint returns 401 when user is not authenticated")
    void logoutReturnsUnauthorizedOnInvalidCredentials() throws Exception {
      mvc.perform(get("/auth/logout")).andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test@treecreate.dk")
    @DisplayName("/auth/logout endpoint correctly invalidates all user tokens")
    void logoutCorrectlyInvalidatesUserTokens() throws Exception {
      User user = new User();
      user.setUserId(UUID.fromString("c0a80121-7ab6-1787-817a-b69966240000"));
      user.setEmail("test@treecreate.dk");
      user.setUsername(user.getEmail());
      // hashed version of "abcDEF123", which is different from the user password in this test
      user.setPassword("$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62");
      Set<Role> roles = new HashSet<>();
      roles.add(new Role(ERole.ROLE_USER));
      user.setRoles(roles);

      String refreshToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtRefreshExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      String authToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      Mockito.when(userRepository.findByEmail(user.getEmail()))
          .thenReturn(java.util.Optional.of(user));

      jwtUtils.whitelistJwtPair(authToken, refreshToken);

      mvc.perform(
          get("/auth/logout")
              .contentType(MediaType.APPLICATION_JSON)
              .header("Authorization", "Bearer " + refreshToken));

      assertFalse(jwtUtils.validateJwtToken(authToken));
      assertFalse(jwtUtils.validateJwtToken(refreshToken));
    }

    @Test
    @WithMockUser(username = "test@treecreate.dk")
    @DisplayName("/auth/logout endpoint returns NO CONTENT after successful logout")
    void logoutReturnsNoContent() throws Exception {
      User user = new User();
      user.setUserId(UUID.fromString("c0a80121-7ab6-1787-817a-b69966240000"));
      user.setEmail("test@treecreate.dk");
      user.setUsername(user.getEmail());
      // hashed version of "abcDEF123", which is different from the user password in this test
      user.setPassword("$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62");
      Set<Role> roles = new HashSet<>();
      roles.add(new Role(ERole.ROLE_USER));
      user.setRoles(roles);

      String refreshToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtRefreshExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      String authToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      Mockito.when(userRepository.findByEmail(user.getEmail()))
          .thenReturn(java.util.Optional.of(user));

      jwtUtils.whitelistJwtPair(authToken, refreshToken);

      mvc.perform(
              get("/auth/logout")
                  .contentType(MediaType.APPLICATION_JSON)
                  .header("Authorization", "Bearer " + refreshToken))
          .andExpect(status().isNoContent())
          .andExpect(content().string(""));
    }

    @Test
    @DisplayName("/auth/logout endpoint makes it not possible to authenticate with old credentials")
    void logoutPreventsAuthWithOldTokens() throws Exception {
      User user = new User();
      user.setUserId(UUID.fromString("c0a80121-7ab6-1787-817a-b69966240000"));
      user.setEmail("test@treecreate.dk");
      user.setUsername(user.getEmail());
      // hashed version of "abcDEF123", which is different from the user password in this test
      user.setPassword("$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62");
      Set<Role> roles = new HashSet<>();
      roles.add(new Role(ERole.ROLE_USER));
      user.setRoles(roles);

      String refreshToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtRefreshExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      String authToken =
          Jwts.builder()
              .setSubject("test@treecreate.dk")
              .setIssuedAt(new Date())
              .setExpiration(
                  new Date((new Date()).getTime() + customProperties.getJwtExpirationMs()))
              .signWith(SignatureAlgorithm.HS512, customProperties.getJwtSecret())
              .compact();

      Mockito.when(userRepository.findByEmail(user.getEmail()))
          .thenReturn(java.util.Optional.of(user));

      jwtUtils.whitelistJwtPair(authToken, refreshToken);

      mvc.perform(
              get("/auth/logout")
                  .contentType(MediaType.APPLICATION_JSON)
                  .header("Authorization", "Bearer " + refreshToken))
          .andExpect(status().isNoContent());

      mvc.perform(
              get("/auth/logout")
                  .contentType(MediaType.APPLICATION_JSON)
                  .header("Authorization", "Bearer " + refreshToken))
          .andExpect(status().isUnauthorized());
    }
  }
}
