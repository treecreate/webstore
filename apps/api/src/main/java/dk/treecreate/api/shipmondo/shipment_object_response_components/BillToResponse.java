package dk.treecreate.api.shipmondo.shipment_object_response_components;

import dk.treecreate.api.shipmondo.shipment_object_components.BillTo;

public class BillToResponse extends BillTo {
  private boolean bill_to_custom;

  // Getters and setters
  public boolean isBill_to_custom() {
    return this.bill_to_custom;
  }

  public boolean getBill_to_custom() {
    return this.bill_to_custom;
  }

  public void setBill_to_custom(boolean bill_to_custom) {
    this.bill_to_custom = bill_to_custom;
  }
}
