package dk.treecreate.api.designs.dto;

import dk.treecreate.api.designs.Design;
import io.swagger.annotations.ApiModelProperty;
import java.util.List;

public class GetAllDesignsResponse {
  @ApiModelProperty(notes = "A list of designs")
  List<Design> designs;
}
