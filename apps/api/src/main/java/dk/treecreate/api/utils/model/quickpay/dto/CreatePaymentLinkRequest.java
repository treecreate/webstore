package dk.treecreate.api.utils.model.quickpay.dto;

/** Represents the data needed for a Quickpay payment link creation */
public class CreatePaymentLinkRequest {
  public int amount;
  // no floating points, multiply the values by 100 to get two-points of precision!
  public String language;
  public String continue_url;
  public String cancel_url;
  public String callback_url;
}
