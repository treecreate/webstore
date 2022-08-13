package dk.treecreate.api.designs.dto;

import dk.treecreate.api.designs.DesignType;
import io.swagger.annotations.ApiModelProperty;
import java.util.Map;
import java.util.UUID;
import javax.validation.constraints.NotNull;

public class UpdateDesignRequest {

  @NotNull
  @ApiModelProperty(example = "c0a80121-7ac0-190b-817a-c08ab0a12345", required = true)
  private UUID designId;

  @NotNull
  @ApiModelProperty(
      example =
          "{ font: 'Roboto',"
              + "  design: 'first',"
              + "  boxSize: 10,"
              + "  banner: false,"
              + "  boxes: []}",
      required = true)
  private Map<String, Object> designProperties;

  @NotNull
  @ApiModelProperty(example = "FAMILY_TREE", required = true)
  private DesignType designType;

  public Map<String, Object> getDesignProperties() {
    return designProperties;
  }

  public void setDesignProperties(Map<String, Object> designProperties) {
    this.designProperties = designProperties;
  }

  public DesignType getDesignType() {
    return designType;
  }

  public void setDesignType(DesignType designType) {
    this.designType = designType;
  }

  public UUID getDesignId() {
    return designId;
  }

  public void setDesignId(UUID designId) {
    this.designId = designId;
  }
}
