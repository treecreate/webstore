package dk.treecreate.api.healthcheck;

import dk.treecreate.api.authentication.jwt.AuthEntryPointJwt;
import dk.treecreate.api.authentication.jwt.JwtUtils;
import dk.treecreate.api.authentication.services.UserDetailsServiceImpl;
import dk.treecreate.api.config.CustomPropertiesConfig;
import dk.treecreate.api.utils.Environment;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(value = HealthcheckController.class)
class HealthcheckTests
{

    @MockBean
    CustomPropertiesConfig customProperties;
    @Autowired
    private MockMvc mvc;
    @MockBean
    private UserDetailsServiceImpl userDetailsService;
    @MockBean
    private AuthEntryPointJwt authEntryPointJwt;
    @MockBean
    private JwtUtils jwtUtils;

    @Test // MockMvc throws Exception, so i must catch it
    void healthcheckReturnedStatusTest() throws Exception
    {
        Mockito.when(customProperties.getEnvironment()).thenReturn(Environment.STAGING);
        mvc.perform(get("/healthcheck")).andExpect(status().isOk());
    }

    @Test // MockMvc throws Exception, so i must catch it
    void healthcheckBodyTest() throws Exception
    {
        Mockito.when(customProperties.getEnvironment()).thenReturn(Environment.STAGING);

        mvc.perform(get("/healthcheck")
            // Ensure it is a Json
            .contentType(MediaType.APPLICATION_JSON))
            // Check the contents of the body.
            .andExpect(jsonPath("status", is("OK")))
            .andExpect(jsonPath("message", is("Server is live")))
            .andExpect(jsonPath("environment", is("STAGING")));
    }
}
