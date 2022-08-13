package dk.treecreate.api.utils.model.quickpay;

public enum QuickpayOperationType {
  AUTHORIZE("authorize"),
  CAPTURE("capture"),
  REFUND("refund");

  public final String label;

  QuickpayOperationType(String label) {
    this.label = label;
  }
}
