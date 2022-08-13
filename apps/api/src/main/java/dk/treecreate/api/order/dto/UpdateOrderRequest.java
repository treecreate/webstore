package dk.treecreate.api.order.dto;

import dk.treecreate.api.contactinfo.dto.UpdateContactInfoRequest;
import dk.treecreate.api.utils.OrderStatus;
import io.swagger.annotations.ApiModelProperty;
import javax.persistence.Column;
import javax.validation.Valid;

public class UpdateOrderRequest {
  @Column(name = "status", nullable = false)
  @ApiModelProperty(notes = "Status of the quickpay payment", example = "PENDING")
  private OrderStatus status;

  @ApiModelProperty(notes = "Contact info for the given order")
  @Valid()
  private UpdateContactInfoRequest contactInfo;

  public OrderStatus getStatus() {
    return status;
  }

  public void setStatus(OrderStatus status) {
    this.status = status;
  }

  public UpdateContactInfoRequest getContactInfo() {
    return contactInfo;
  }

  public void setContactInfo(UpdateContactInfoRequest contactInfo) {
    this.contactInfo = contactInfo;
  }
}
