package dk.treecreate.api.order.dto;

import io.swagger.annotations.ApiModelProperty;

public class GetPlantedTreesResponse {
  @ApiModelProperty(example = "10")
  long plantedTrees;

  public GetPlantedTreesResponse(Float number) {
    this.plantedTrees = Math.round(number);
  }

  public long getPlantedTrees() {
    return plantedTrees;
  }

  public void setPlantedTrees(Float plantedTrees) {
    this.plantedTrees = Math.round(plantedTrees);
  }
}
