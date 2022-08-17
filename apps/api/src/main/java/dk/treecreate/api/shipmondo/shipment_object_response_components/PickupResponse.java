package dk.treecreate.api.shipmondo.shipment_object_response_components;

import dk.treecreate.api.shipmondo.shipment_object_components.PickUp;

public class PickupResponse extends PickUp {
  private boolean pickup_custom;

  // Getters and setters
  public boolean isPickup_custom() {
    return this.pickup_custom;
  }

  public boolean getPickup_custom() {
    return this.pickup_custom;
  }

  public void setPickup_custom(boolean pickup_custom) {
    this.pickup_custom = pickup_custom;
  }
}
