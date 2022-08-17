package dk.treecreate.api.healthcheck;

import dk.treecreate.api.config.CustomPropertiesConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/healthcheck")
public class HealthcheckController {
  @Autowired CustomPropertiesConfig customProperties;

  @GetMapping("")
  @ResponseStatus(HttpStatus.OK)
  public HealthcheckDto healthCheck() {
    HealthcheckDto response = new HealthcheckDto();
    response.setMessage("Server is live");
    response.setStatus("OK");
    response.setEnvironment(customProperties.getEnvironment());

    return response;
  }
}
