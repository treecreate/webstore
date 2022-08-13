package dk.treecreate.api.errorlog.dto;

import dk.treecreate.api.errorlog.Errorlog;
import io.swagger.annotations.ApiModelProperty;
import java.util.List;

public class GetErrorlogsResponse {
  @ApiModelProperty(notes = "A list of errorlogs")
  List<Errorlog> errorlogs;
}
