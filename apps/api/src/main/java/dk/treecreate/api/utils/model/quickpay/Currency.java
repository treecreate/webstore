package dk.treecreate.api.utils.model.quickpay;

/** Currencies treecreate supports */
// NOTE - these will not change for a while...I don't wanna have to support multiple currencies...
public enum Currency {
  DKK("dkk");

  public final String label;

  Currency(String label) {
    this.label = label;
  }
}
