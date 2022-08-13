package dk.treecreate.api.transactionitem.dto;

import dk.treecreate.api.designs.DesignDimension;
import io.swagger.annotations.ApiModelProperty;
import java.util.UUID;
import javax.validation.constraints.NotNull;

public class CreateTransactionItemRequest {
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
  @ApiModelProperty(
      notes = "The id of the referenced design",
      example = "c0a80121-7ac0-190b-817a-c08ab0a12345",
      required = true)
  private UUID designId;

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

  public UUID getDesignId() {
    return designId;
  }

  public void setDesignId(UUID designId) {
    this.designId = designId;
  }

  // TODO: Add OrderId as a field that can be updated?
}
