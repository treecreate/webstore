package dk.treecreate.api.healthcheck;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
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

  @Autowired
  private MockMvc mvc;

  @Test
    // MockMvc throws Exception, so i must catch it
  void healthcheckReturnedStatusTest() throws Exception
  {
    mvc.perform(
      get("/healthcheck"))
      .andExpect(status().isOk());
  }

  @Test
    // MockMvc throws Exception, so i must catch it
  void healthcheckBodyTest() throws Exception
  {
    mvc.perform(get("/healthcheck")
      // Ensure it is a Json
      .contentType(MediaType.APPLICATION_JSON))
      // Check the contents of the body.
      .andExpect(jsonPath("status", is("OK")))
      .andExpect(jsonPath("message", is("Server is live")));
  }
}
