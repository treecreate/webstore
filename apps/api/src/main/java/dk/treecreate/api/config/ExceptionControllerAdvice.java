package dk.treecreate.api.config;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;

import javax.validation.ConstraintViolationException;
import java.io.IOException;
import java.util.Objects;

@ControllerAdvice
public class ExceptionControllerAdvice
{

    @ExceptionHandler(ConstraintViolationException.class)
    public void handleConstraintViolationException(ConstraintViolationException exception,
                                                   ServletWebRequest webRequest) throws IOException
    {
        Objects.requireNonNull(webRequest.getResponse())
            .sendError(HttpStatus.BAD_REQUEST.value(), exception.getMessage());
    }
}
