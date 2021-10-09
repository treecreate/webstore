package dk.treecreate.api.utils.model.quickpay;

/**
 * Represents the Quickpay Payment model, used for creating payments
 */
public class Payment
{
    public String id;
    public String order_id;
    public Currency currency = Currency.DKK;
    public PaymentAddress invoice_address;
    public PaymentAddress shipping_address;
    public PaymentShipping shipping;
    public PaymentVariables variables;

    @Override public String toString()
    {
        return "Payment{" +
            "id='" + id + '\'' +
            ", order_id='" + order_id + '\'' +
            ", currency=" + currency +
            ", variables=" + variables +
            '}';
    }
}
