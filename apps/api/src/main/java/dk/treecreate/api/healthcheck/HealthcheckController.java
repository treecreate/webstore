package dk.treecreate.api.healthcheck;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/healthcheck")
public class HealthcheckController
{
    @GetMapping("")
    public HttpStatus healthCheck()
    {
        return HttpStatus.OK;
    }
}
