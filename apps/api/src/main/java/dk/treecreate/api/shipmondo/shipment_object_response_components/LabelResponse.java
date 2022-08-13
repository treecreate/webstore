package dk.treecreate.api.shipmondo.shipment_object_response_components;

public class LabelResponse {
  private String base64;
  private String file_format;

  // Getters and Setters
  public String getBase64() {
    return this.base64;
  }

  public void setBase64(String base64) {
    this.base64 = base64;
  }

  public String getFile_format() {
    return this.file_format;
  }

  public void setFile_format(String file_format) {
    this.file_format = file_format;
  }
}
