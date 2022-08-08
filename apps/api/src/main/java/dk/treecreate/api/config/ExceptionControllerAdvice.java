package dk.treecreate.api.config;

import java.io.IOException;
import java.util.Objects;
import javax.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;

@ControllerAdvice
public class ExceptionControllerAdvice {

  @ExceptionHandler(ConstraintViolationException.class)
  public void handleConstraintViolationException(
      ConstraintViolationException exception, ServletWebRequest webRequest) throws IOException {
    Objects.requireNonNull(webRequest.getResponse())
        .sendError(HttpStatus.BAD_REQUEST.value(), exception.getMessage());
  }
}
