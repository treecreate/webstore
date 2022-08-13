package dk.treecreate.api.shipmondo.shipment_object_components;

import dk.treecreate.api.shipmondo.utility.Address;

public class ServicePoint extends Address {
  private String id;
  private String name;
  private String shipping_agent;

  /** Blank class constructor */
  ServicePoint() {
    /* Blank Constructor */
  }

  /**
   * Class constructor with all attributes
   *
   * @param id Identifier of the service point.
   * @param name Name of the service point.
   * @param address Address object with all relevant information
   */
  ServicePoint(String id, String name, String shipping_agent, Address address) {
    this.id = id;
    this.name = name;
    this.shipping_agent = shipping_agent;
    this.address1 = address.getAddress1();
    this.address2 = address.getAddress2();
    this.zipcode = address.getZipcode();
    this.city = address.getCity();
    this.country_code = address.getCountry_code();
  }

  // Getters and setters
  public String getId() {
    return this.id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return this.name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getShipping_agent() {
    return this.shipping_agent;
  }

  public void setShipping_agent(String shipping_agent) {
    this.shipping_agent = shipping_agent;
  }

  @Override
  public String toString() {
    return "{"
        + " id='"
        + getId()
        + "'"
        + ", name='"
        + getName()
        + "'"
        + ", shipping_agent='"
        + getShipping_agent()
        + "'"
        + ", address1='"
        + getAddress1()
        + "'"
        + ", address2='"
        + getAddress2()
        + "'"
        + ", zipcode='"
        + getZipcode()
        + "'"
        + ", city='"
        + getCity()
        + "'"
        + ", country_code='"
        + getCountry_code()
        + "'"
        + "}";
  }
}
