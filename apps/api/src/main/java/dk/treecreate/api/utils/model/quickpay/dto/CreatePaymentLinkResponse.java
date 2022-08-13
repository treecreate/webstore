package dk.treecreate.api.utils.model.quickpay.dto;

/** Represents the data returned by quickpay after a successful payment creation */
public class CreatePaymentLinkResponse {
  private String url;

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }
}
