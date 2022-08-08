package dk.treecreate.api.newsletter.dto;

import dk.treecreate.api.newsletter.Newsletter;
import io.swagger.annotations.ApiModelProperty;
import java.util.List;

public class GetNewslettersResponse {
  @ApiModelProperty(notes = "A list of newsletters")
  List<Newsletter> newsletters;
}
