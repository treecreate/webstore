/*
   Uses ExceptionController to trigger various exceptions and validates the output
*/

package dk.treecreate.api.exceptionhandling;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dk.treecreate.api.authentication.jwt.AuthEntryPointJwt;
import dk.treecreate.api.authentication.jwt.JwtUtils;
import dk.treecreate.api.authentication.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(SpringExtension.class)
@WebMvcTest(
    value = ExceptionController.class,
    excludeAutoConfiguration = SecurityAutoConfiguration.class)
@WithMockUser(
    username = "test@treecreate.dk",
    password = "testPassword",
    roles = {"USER", "DEVELOPER", "ADMIN"})
class RestResponseEntityExceptionHandlerTests {
  @Autowired private MockMvc mvc;

  @MockBean private UserDetailsServiceImpl userDetailsService;

  @MockBean private AuthEntryPointJwt authEntryPointJwt;

  @MockBean private JwtUtils jwtUtils;

  @Test
  void handleResponseStatusException() throws Exception {
    String exceptionName = "ResponseStatusException";
    mvc.perform(
            post("/exception")
                .param("exceptionName", exceptionName)
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isIAmATeapot())
        .andExpect(
            result -> assertTrue(result.getResolvedException() instanceof ResponseStatusException));
  }

  @Test
  void handleResponseStatusExceptionCustom() throws Exception {
    String exceptionName = "ResponseStatusException";
    String customMessage = "Custom Response Status Exception";
    mvc.perform(
            post("/exception")
                .contentType(MediaType.APPLICATION_JSON)
                .param("exceptionName", exceptionName)
                .param("customMessage", customMessage))
        .andExpect(status().isIAmATeapot())
        .andExpect(
            result -> assertTrue(result.getResolvedException() instanceof ResponseStatusException))
        // The exception message in ResponseStatusException includes the status code and error type
        // so it has to be added to expected message
        .andExpect(
            result ->
                assertEquals(
                    "418 I_AM_A_TEAPOT \"" + customMessage + "\"",
                    result.getResolvedException().getMessage()));
  }

  @Test
  void handleResourceNotFound() throws Exception {
    String exceptionName = "ResourceNotFoundException";
    mvc.perform(
            post("/exception")
                .param("exceptionName", exceptionName)
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(
            result ->
                assertTrue(result.getResolvedException() instanceof ResourceNotFoundException));
  }

  @Test
  void handleResourceNotFoundCustom() throws Exception {
    String exceptionName = "ResourceNotFoundException";
    String customMessage = "Failed to find a resource";
    mvc.perform(
            post("/exception")
                .contentType(MediaType.APPLICATION_JSON)
                .param("exceptionName", exceptionName)
                .param("customMessage", customMessage))
        .andExpect(status().isNotFound())
        .andExpect(
            result ->
                assertTrue(result.getResolvedException() instanceof ResourceNotFoundException))
        .andExpect(
            result -> assertEquals(customMessage, result.getResolvedException().getMessage()));
  }
}
