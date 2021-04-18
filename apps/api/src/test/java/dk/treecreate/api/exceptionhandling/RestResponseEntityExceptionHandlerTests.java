/*
    Uses ExceptionController to trigger various exceptions and validates the output
 */

package dk.treecreate.api.exceptionhandling;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(value = ExceptionController.class,
    excludeAutoConfiguration = SecurityAutoConfiguration.class)
class RestResponseEntityExceptionHandlerTests
{
    @Autowired
    private MockMvc mvc;

    @Test
    void handleResponseStatusException() throws Exception
    {
        String exceptionName = "ResponseStatusException";
        mvc.perform(post("/exception").param("exceptionName", exceptionName)
            .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isIAmATeapot()).andExpect(
            result -> assertTrue(result.getResolvedException() instanceof ResponseStatusException));
    }

    @Test
    void handleResponseStatusExceptionCustom() throws Exception
    {
        String exceptionName = "ResponseStatusException";
        String customMessage = "Custom Response Status Exception";
        mvc.perform(post("/exception").contentType(MediaType.APPLICATION_JSON)
            .param("exceptionName", exceptionName).param("customMessage", customMessage))
            .andExpect(status().isIAmATeapot()).andExpect(
            result -> assertTrue(result.getResolvedException() instanceof ResponseStatusException))
            // The exception message in ResponseStatusException includes the status code and error type so it has to be added to expected message
            .andExpect(result -> assertEquals("418 I_AM_A_TEAPOT \"" + customMessage + "\"",
                result.getResolvedException().getMessage()));
    }

    @Test
    void handleResourceNotFound() throws Exception
    {
        String exceptionName = "ResourceNotFoundException";
        mvc.perform(post("/exception").param("exceptionName", exceptionName)
            .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isNotFound()).andExpect(
            result -> assertTrue(
                result.getResolvedException() instanceof ResourceNotFoundException));
    }

    @Test
    void handleResourceNotFoundCustom() throws Exception
    {
        String exceptionName = "ResourceNotFoundException";
        String customMessage = "Failed to find a resource";
        mvc.perform(post("/exception").contentType(MediaType.APPLICATION_JSON)
            .param("exceptionName", exceptionName).param("customMessage", customMessage))
            .andExpect(status().isNotFound()).andExpect(result -> assertTrue(
            result.getResolvedException() instanceof ResourceNotFoundException)).andExpect(
            result -> assertEquals(customMessage, result.getResolvedException().getMessage()));
    }

}
