package dk.treecreate.api.transactionitem.dto;

import dk.treecreate.api.designs.DesignDimension;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;


public class UpdateTransactionItemRequest
{
    @NotNull
    @ApiModelProperty(notes = "The quantity of how many items are included", example = "1", required = true)
    private int quantity;

    @NotNull
    @ApiModelProperty(notes = "The dimension of the referenced design", example = "SMALL", required = true)
    private DesignDimension dimension;

    public int getQuantity()
    {
        return quantity;
    }

    public void setQuantity(int quantity)
    {
        this.quantity = quantity;
    }

    public DesignDimension getDimension()
    {
        return dimension;
    }

    public void setDimension(DesignDimension dimension)
    {
        this.dimension = dimension;
    }

    // TODO: Add OrderId as a field that can be updated?
}
