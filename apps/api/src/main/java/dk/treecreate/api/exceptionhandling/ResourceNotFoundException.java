package dk.treecreate.api.exceptionhandling;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public final class ResourceNotFoundException extends RuntimeException
{
  public ResourceNotFoundException()
  {
    super();
  }

  public ResourceNotFoundException(final String message)
  {
    super(message);
  }
}
