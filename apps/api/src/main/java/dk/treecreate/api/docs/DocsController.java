/*
 Controller methods related to the Swagger UI documentation
*/
package dk.treecreate.api.docs;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import springfox.documentation.annotations.ApiIgnore;

@Controller
@ApiIgnore
@RequestMapping("/docs")
public class DocsController {

  // a simple redirect to the docs page. A simple quality of life improvement
  @GetMapping("")
  public String swaggerDocs() {
    return "redirect:/swagger-ui/";
  }
}
