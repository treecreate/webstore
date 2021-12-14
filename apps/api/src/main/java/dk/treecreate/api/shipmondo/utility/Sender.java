package dk.treecreate.api.shipmondo.utility;

public class Sender extends Address{
   
    private String name; // Required
    private String attention;
    private String vat_id;
    private String email;
    private String mobile;
    private String telephone;

    /**
     * Blank class constructor
     */
    public Sender() { /* Blank constructor */}

    /**
     * Class constructor containing the minimum required fields. <p>
     * You can choose wether or not to include address2 in your Address
     * @param name Name of sender
     * @param address Address object containing information about the sender
     */
    public Sender(String name, Address address) {
        this.name = name;
        this.address1 = address.getAddress1();
        this.address2 = address.getAddress2();
        this.zipcode = address.getZipcode();
        this.city = address.getCity();
        this.country_code = address.getCountry_code();
    }

    /**
     * Class constructor containing all possible fields
     * @param name Name of sender
     * @param attention Attention of the sender. If the sender is a company, it is the contact person.
     * @param vat_id Special VAT idenfication number i.e. GB EORI for Great Britain or VOEC for Norway.
     * @param email Email of the sender
     * @param mobile Mobile number of the sender
     * @param telephone Landline phone number of the sender
     * @param address Address object containing information about the sender
     */
    public Sender(String name,String attention, String vat_id, String email, String mobile, String telephone, Address address) {
        this.name = name;
        this.attention = attention;
        this.vat_id = vat_id;
        this.email = email;
        this.mobile = mobile;
        this.telephone = telephone;
        this.address1 = address.getAddress1();
        this.address2 = address.getAddress2();
        this.zipcode = address.getZipcode();
        this.city = address.getCity();
        this.country_code = address.getCountry_code();
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
