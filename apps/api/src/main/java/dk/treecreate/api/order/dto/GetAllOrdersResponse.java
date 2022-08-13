package dk.treecreate.api.order.dto;

import dk.treecreate.api.order.Order;
import io.swagger.annotations.ApiModelProperty;
import java.util.List;

public class GetAllOrdersResponse {
  @ApiModelProperty(notes = "A list of orders")
  List<Order> orders;
}
