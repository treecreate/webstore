package dk.treecreate.api.healthcheck;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;


@RestController()
@RequestMapping("/healthcheck")
public class HealthcheckController
{
  @GetMapping("")
  @ResponseStatus(HttpStatus.OK)
  public Map<String, String> healthCheck()
  {
    // HashMap can be changed to Json Object if needed.
    Map<String, String> map = new HashMap<>();
    map.put("status", "OK");
    map.put("message", "Server is live");
    return map;
  }
}
