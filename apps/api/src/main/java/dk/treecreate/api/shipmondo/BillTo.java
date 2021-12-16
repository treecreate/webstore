package dk.treecreate.api.shipmondo;

import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;

/**
 * Customs billing information if it is other than sender/receiver.
 */
public class BillTo extends Address {
    private String name;
    private String attention;
    private String vat_id;
    private String telephone;
    private String mobile;
    private String email;

    /**
     * Blank class constructor
     */
    public BillTo() {
    }

    /**
     * Class constructor with all possible fields
     * @param vat_id VAT no. of the customs billing party.
     * @param contactInfo ContactInfo object with all relevant information
     * @param address Address object with all relevant information
     */
    public BillTo(String vat_id, ContactInfo contactInfo, Address address) {
        this.name = contactInfo.getName();
        this.attention = contactInfo.getAttention();
        this.address1 = address.getAddress1();
        this.address2 = address.getAddress2();
        this.zipcode = address.getZipcode();
        this.city = address.getCity();
        this.country_code = address.getCountry_code();
        this.vat_id = vat_id;
        this.telephone = contactInfo.getTelephone();
        this.mobile = contactInfo.getMobile();
        this.email = contactInfo.getEmail();
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

    public String getTelephone() {
        return this.telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getMobile() {
        return this.mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    @Override
    public String toString() {
        return "{" +
            " name='" + getName() + "'" +
            ", attention='" + getAttention() + "'" +
            ", address1='" + getAddress1() + "'" +
            ", address2='" + getAddress2() + "'" +
            ", zipcode='" + getZipcode() + "'" +
            ", city='" + getCity() + "'" +
            ", country_code='" + getCountry_code() + "'" +
            ", vat_id='" + getVat_id() + "'" +
            ", telephone='" + getTelephone() + "'" +
            ", mobile='" + getMobile() + "'" +
            ", email='" + getEmail() + "'" +
            "}";
    }

}
