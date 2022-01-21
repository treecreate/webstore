package dk.treecreate.api.shipmondo.shipment_object_components;

import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;

public class ReturnTo extends Address {
    
    private String name;
    private String attention;
    private String telephone;
    

    public ReturnTo() {}

    public ReturnTo(ContactInfo contact, Address address) {
        this.name = contact.getName();
        this.attention = contact.getAttention();
        this.address1 = address.getAddress1();
        this.address2 = address.getAddress2();
        this.zipcode = address.getZipcode();
        this.city = address.getCity();
        this.country_code = address.getCountry_code();
        this.telephone = contact.getTelephone();
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

    public String getTelephone() {
        return this.telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

}
