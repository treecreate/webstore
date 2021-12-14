package dk.treecreate.api.shipmondo.utility;

public class Address {

    protected String address1;        // Required
    protected String address2;
    protected String zipcode;          // Required
    protected String city;             // Required
    protected String country_code;     // Required

    /**
     * Empty Class constructor
     */
    public Address() { /* Empty constructor */ }

    /**
     * Class constructor with only address 1
     * @param address1 Address of the receiver, including address number.
     * @param zipcode Name of the city that the zipcode refers to.
     * @param city Name of the city that the zipcode refers to.
     * @param country_code ISO 3166-1 alpha-2 country code of the receiver address.
     */
    public Address(String address1, String zipcode, String city, String country_code) {
        this.address1 = address1;
        this.zipcode = zipcode;
        this.city = city;
        this.country_code = country_code;
    }

    /**
     * Class constructor with both addresses  
     * @param address1 Address of the receiver, including address number.
     * @param address2 Second address line of the receiver. Can be used for i.e. apartment number.
     * @param zipcode Name of the city that the zipcode refers to.
     * @param city Name of the city that the zipcode refers to.
     * @param country_code ISO 3166-1 alpha-2 country code of the receiver address.
     */
    public Address(String address1, String address2, String zipcode, String city, String country_code) {
        this.address1 = address1;
        this.address2 = address2;
        this.zipcode = zipcode;
        this.city = city;
        this.country_code = country_code;
    }

    // Getters and setters 
    public String getAddress1() {
        return this.address1;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    public String getAddress2() {
        if (address2 != null) {
            return this.address2;
        } else {
            return "null";
        }
    }

    public void setAddress2(String address2) {
        this.address2 = address2;
    }

    public String getZipcode() {
        return this.zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }

    public String getCity() {
        return this.city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry_code() {
        return this.country_code;
    }

    public void setCountry_code(String country_code) {
        this.country_code = country_code;
    }

    @Override
    public String toString() {
        return "{" +
            " address1='" + getAddress1() + "'" +
            ", address2='" + getAddress2() + "'" +
            ", zipcode='" + getZipcode() + "'" +
            ", city='" + getCity() + "'" +
            ", country_code='" + getCountry_code() + "'" +
            "}";
    }
    
}
