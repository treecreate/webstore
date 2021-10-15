package dk.treecreate.api.utils.model.quickpay;

/**
 * Represents the address information the Quickpay Payment model, used for creating payments
 */
public class PaymentAddress
{
    public String name;
    public String street;
    public String house_extension;
    public String city;
    public String zip_code;
    public String region; // used as country
    public String phone_number;
    public String email;
}
