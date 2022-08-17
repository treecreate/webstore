package dk.treecreate.api.transactionitem.dto;

import dk.treecreate.api.designs.DesignDimension;
import dk.treecreate.api.designs.dto.CreateDesignRequest;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class CreateBulkTransactionItemRequest {
  @NotNull
  @ApiModelProperty(
      notes = "The quantity of how many items are included",
      example = "1",
      required = true)
  private int quantity;

  @NotNull
  @ApiModelProperty(
      notes = "The dimension of the referenced design",
      example = "SMALL",
      required = true)
  private DesignDimension dimension;

  @NotNull
  @Valid
  @ApiModelProperty(notes = "Information about a design that should be created", required = true)
  private CreateDesignRequest design;

  public int getQuantity() {
    return quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public DesignDimension getDimension() {
    return dimension;
  }

  public void setDimension(DesignDimension dimension) {
    this.dimension = dimension;
  }

  public CreateDesignRequest getDesign() {
    return design;
  }

  public void setDesign(CreateDesignRequest design) {
    this.design = design;
  }
}
