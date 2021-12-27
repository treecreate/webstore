package dk.treecreate.api.shipmondo.utility;

public class ContactInfo {
    private String name ;
    private String attention ;
    private String telephone ;
    private String mobile ;
    private String email ;

    /**
     * Blank class constructor <p>
     * All fields are defaulted to null so that you can add only what you need
     */
    public ContactInfo() { /* Blank constructor */ }

    /**
     * Class constructor used for for ReturnTo
     * @param name
     * @param attention // Optional, can be null or ""
     * @param telephone
     */
    public ContactInfo(String name, String attention, String telephone) {
        this.name = name;
        this.attention = attention;
        this.telephone = telephone;
    }

    /**
     * Class constructor with all possible fields
     * @param name 
     * @param attention // Optional, can be null or ""
     * @param telephone
     * @param mobile
     * @param email
     */
    public ContactInfo(String name, String attention, String telephone, String mobile, String email) {
        this.name = name;
        this.attention = attention; // Optional, can be null or ""
        this.telephone = telephone;
        this.mobile = mobile;
        this.email = email;
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
            ", telephone='" + getTelephone() + "'" +
            ", mobile='" + getMobile() + "'" +
            ", email='" + getEmail() + "'" +
            "}";
    }

}
