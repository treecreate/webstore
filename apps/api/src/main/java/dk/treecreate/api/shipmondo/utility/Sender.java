package dk.treecreate.api.shipmondo.utility;

/** Sender information for the object */
public class Sender extends Address {

  private String name; // Required
  private String attention;
  private String vat_id;
  private String email;
  private String mobile;
  private String telephone;

  /** Blank class constructor */
  public Sender() {
    /* Blank constructor */
  }

  /**
   * Class constructor containing the minimum required fields.
   *
   * <p>You can choose wether or not to include address2 in your Address Country code is always set
   * to DK as we only send from there
   *
   * @param name Name of sender
   * @param address Address object containing information about the sender
   */
  public Sender(String name, Address address) {
    this.name = name;
    this.address1 = address.getAddress1();
    this.address2 = address.getAddress2();
    this.zipcode = address.getZipcode();
    this.city = address.getCity();
    this.country_code = "DK";
  }

  /**
   * Class constructor containing the minimum required fields.
   *
   * <p>You can choose wether or not to include address2 in your Address Country code is always set
   * to DK as we only send from there
   *
   * @param name Name of sender
   * @param email Email of the sender
   * @param address Address object containing information about the sender
   */
  public Sender(String name, String email, Address address) {
    this.name = name;
    this.email = email;
    this.address1 = address.getAddress1();
    this.address2 = address.getAddress2();
    this.zipcode = address.getZipcode();
    this.city = address.getCity();
    this.country_code = "DK";
  }
  /**
   * Class constructor containing all possible fields Country code is always set to DK as we only
   * send from there
   *
   * @param name Name of sender
   * @param attention Attention of the sender. If the sender is a company, it is the contact person.
   * @param vat_id Special VAT idenfication number i.e. GB EORI for Great Britain or VOEC for
   *     Norway.
   * @param email Email of the sender
   * @param mobile Mobile number of the sender
   * @param telephone Landline phone number of the sender
   * @param address Address object containing information about the sender
   */
  public Sender(String vat_id, ContactInfo contact, Address address) {
    this.name = contact.getName();
    this.attention = contact.getAttention();
    this.vat_id = vat_id;
    this.email = contact.getEmail();
    this.mobile = contact.getMobile();
    this.telephone = contact.getTelephone();
    this.address1 = address.getAddress1();
    this.address2 = address.getAddress2();
    this.zipcode = address.getZipcode();
    this.city = address.getCity();
    this.country_code = "DK";
  }

  /**
   * Creates an instance of the Sender object with all the default TreeCreate values set up.
   *
   * @return Sender
   * @throws Exception - Can never trigger on this function call as the default is correct.
   */
  public static Sender treecreateDefault() {
    var address = Address.treecreateDefault();
    return new Sender("TreeCreate", "nyt604@gmail.com", address);
  }

  // Getter and setters
  public String getName() {
    return this.name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getAttention() {
    return this.attention;
  }

  public void setAttention(String attention) {
    this.attention = attention;
  }

  public String getVat_id() {
    return this.vat_id;
  }

  public void setVat_id(String vat_id) {
    this.vat_id = vat_id;
  }

  public String getEmail() {
    return this.email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getMobile() {
    return this.mobile;
  }

  public void setMobile(String mobile) {
    this.mobile = mobile;
  }

  public String getTelephone() {
    return this.telephone;
  }

  public void setTelephone(String telephone) {
    this.telephone = telephone;
  }
}
