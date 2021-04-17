package dk.treecreate.api.healthcheck;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


@RestController()
@RequestMapping("/healthcheck")
public class HealthcheckController
{
  @GetMapping("")
  @ResponseStatus(HttpStatus.OK)
  public HealthcheckDto healthCheck()
  {

    HealthcheckDto response = new HealthcheckDto();
    response.setMessage("Server is live");
    response.setStatus("OK");

    return response;
  }
}
