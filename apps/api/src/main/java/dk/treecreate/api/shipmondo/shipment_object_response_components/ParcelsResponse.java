package dk.treecreate.api.shipmondo.shipment_object_response_components;

import dk.treecreate.api.shipmondo.shipment_object_components.Parcels;
import java.util.List;

public class ParcelsResponse extends Parcels {
  private String pkg_no;
  private List<String> pkg_nos;
  private String content;
  private String packaging;

  // Getters and setters

  public String getPkg_no() {
    return this.pkg_no;
  }

  public void setPkg_no(String pkg_no) {
    this.pkg_no = pkg_no;
  }

  public List<String> getPkg_nos() {
    return this.pkg_nos;
  }

  public void setPkg_nos(List<String> pkg_nos) {
    this.pkg_nos = pkg_nos;
  }

  public String getContent() {
    return this.content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public String getPackaging() {
    return this.packaging;
  }

  public void setPackaging(String packaging) {
    this.packaging = packaging;
  }
}
