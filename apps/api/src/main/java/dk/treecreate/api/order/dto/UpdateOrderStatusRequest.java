package dk.treecreate.api.order.dto;

import dk.treecreate.api.utils.OrderStatus;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

public class UpdateOrderStatusRequest
{
    @NotNull
    @ApiModelProperty(notes = "Status of the order", example = "PENDING",
        required = true)
    private OrderStatus status;

    public OrderStatus getStatus()
    {
        return status;
    }

    public void setStatus(OrderStatus status)
    {
        this.status = status;
    }
}
