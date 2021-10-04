package dk.treecreate.api.order.dto;

import dk.treecreate.api.order.Order;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

public class GetOrdersResponse
{
    @ApiModelProperty(notes = "A list of orders")
    List<Order> orders;

    public List<Order> getOrders()
    {
        return orders;
    }

    public void setOrders(List<Order> orders)
    {
        this.orders = orders;
    }
}
