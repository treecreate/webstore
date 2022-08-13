/*
   A helper class used by the exception handler testing for the purposes of mocking
   Throws various exceptions based of the input
*/

package dk.treecreate.api.exceptionhandling;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ExceptionController {
  @PostMapping("/exception")
  public void getSpecificException(
      @RequestParam(name = "exceptionName") String exceptionName,
      @RequestParam(required = false, name = "customMessage") String customMessage) {
    switch (exceptionName) {
      case "ResponseStatusException":
        if (customMessage != null)
          throw new ResponseStatusException(HttpStatus.I_AM_A_TEAPOT, customMessage);
        else throw new ResponseStatusException(HttpStatus.I_AM_A_TEAPOT);
      case "ResourceNotFoundException":
        if (customMessage != null) throw new ResourceNotFoundException(customMessage);
        else throw new ResourceNotFoundException();
    }
  }
}
