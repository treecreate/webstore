package dk.treecreate.api.shipmondo.shipment_object_components;

public class Dfm {
  private String insurance_type;
  private double insurance_amount;
  private String dot_type;
  private String dot_time;

  /** Blank class constructor */
  public Dfm() {
    /* Blank class constructor */
  }

  /**
   * Class constructor with all possible values
   *
   * @param insurance_type Type of insurance to be booked.
   *     <p>Allowed values: ["A", "B", "C", "D"]
   * @param insurance_amount Amount in DKK that should be insured for the shipment.
   * @param dot_type Type of DOT used for the shipment.
   *     <p>Allowed values: ["DO1", "DO2", "DO3", "DO4"]
   * @param dot_time Requested time of DOT delivery. Only valid for DO2, DO3 and DO4.
   */
  public Dfm(String insurance_type, double insurance_amount, String dot_type, String dot_time) {
    this.insurance_type = insurance_type;
    this.insurance_amount = insurance_amount;
    this.dot_type = dot_type;
    this.dot_time = dot_time;
  }

  // Getters and setters
  public String getInsurance_type() {
    return this.insurance_type;
  }

  public void setInsurance_type(String insurance_type) {
    this.insurance_type = insurance_type;
  }

  public double getInsurance_amount() {
    return this.insurance_amount;
  }

  public void setInsurance_amount(double insurance_amount) {
    this.insurance_amount = insurance_amount;
  }

  public String getDot_type() {
    return this.dot_type;
  }

  public void setDot_type(String dot_type) {
    this.dot_type = dot_type;
  }

  public String getDot_time() {
    return this.dot_time;
  }

  public void setDot_time(String dot_time) {
    this.dot_time = dot_time;
  }
}
