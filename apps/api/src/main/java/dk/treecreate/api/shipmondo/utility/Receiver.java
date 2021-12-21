package dk.treecreate.api.shipmondo.utility;

/**
 * Receiver information for the object
 */
public class Receiver extends Address {

    private String name; // Required
    private String attention;
    private String vat_id; // Special VAT identification number i.e. GB EORI for Great Britain.
    private String email; // Email of the receiver
    private String mobile; // Mobile number of the receiver
    private String telephone; // Landline of the receiver
    private String instruction; // Delivery instruction to the carrier.
    private String date; // String with the Date format
    private String from_time; // Requested earliest delivery time
    private String to_time; // Requested latest delivery time
    private String member_id; // Carrier member ID
    private String access_code; // Gate/door code for the carrier to access the receiver's address


    public Receiver() { /* Blank constructor */ }

    /**
     * Class constructor with the most likely to be used parameters
     * @param instruction Delivery instruction to the carrier.
     * @param contact Contact object containing all relevant fields
     * @param address Address object containing all relevant fields
     */
    public Receiver(String instruction, ContactInfo contact, Address address) {
        this.instruction = instruction;
        this.name = contact.getName();
        this.attention = contact.getAttention();
        this.address1 = address.getAddress1();
        this.address2 = address.getAddress2();
        this.zipcode = address.getZipcode();
        this.city = address.getCity();
        this.country_code = address.getCountry_code();
        this.email = contact.getEmail();
        this.mobile = contact.getMobile();
        this.telephone = contact.getTelephone();
    }

    /**
     * Class constructor with all possible fields
     * @param vat_id Special VAT identification number i.e. GB EORI for Great Britain.
     * @param instruction Delivery instruction to the carrier.
     * @param member_id Carrier member ID
     * @param access_code Gate/door code for the carrier to access the receiver's address
     * @param address Address object containing all relevant fields
     * @param contact Contact object containing all relevant fields
     * @param dnt DateAndTime object containing all relevant fields
     */
    public Receiver(String vat_id, String instruction, String member_id, String access_code, Address address, ContactInfo contact, DateAndTime dnt) {
        this.name = contact.getName();
        this.attention = contact.getAttention();
        this.address1 = address.getAddress1();
        this.address2 = address.getAddress2();
        this.zipcode = address.getZipcode();
        this.city = address.getCity();
        this.country_code = address.getCountry_code();
        this.vat_id = vat_id;
        this.email = contact.getEmail();
        this.mobile = contact.getMobile();
        this.telephone = contact.getTelephone();
        this.instruction = instruction;
        this.date = dnt.getDate();
        this.from_time = dnt.getFrom_time();
        this.to_time = dnt.getTo_time();
        this.member_id = member_id;
        this.access_code = access_code;
    }


    // Getters and setters
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

    public String getInstruction() {
        return this.instruction;
    }

    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }

    public String getDate() {
        return this.date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getFrom_time() {
        return this.from_time;
    }

    public void setFrom_time(String from_time) {
        this.from_time = from_time;
    }

    public String getTo_time() {
        return this.to_time;
    }

    public void setTo_time(String to_time) {
        this.to_time = to_time;
    }

    public String getMember_id() {
        return this.member_id;
    }

    public void setMember_id(String member_id) {
        this.member_id = member_id;
    }

    public String getAccess_code() {
        return this.access_code;
    }

    public void setAccess_code(String access_code) {
        this.access_code = access_code;
    }

    

}
