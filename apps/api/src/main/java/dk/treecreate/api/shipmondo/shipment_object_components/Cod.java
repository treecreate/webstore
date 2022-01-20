package dk.treecreate.api.shipmondo.shipment_object_components;

/**
 * Used for COD (Cash on Delivery) shipments, when booking with service code COD
 */
public class Cod {
    private double amount;
    private String currency_code;
    private String account_number;

    /**
     * Blank class constructor
     */
    public Cod() { /* Blank class constructor */ }

    /**
     * Class constructor with all possible fields
     * @param amount The amount to be collected.
     * @param currency_code Currency code of the amount.
     * @param account_number The account number which should receiver the amount that has been collected.
     */
    public Cod(double amount, String currency_code, String account_number) {
        this.amount = amount;
        this.currency_code = currency_code;
        this.account_number = account_number;
    }


    // Getters and setters
    public double getAmount() {
        return this.amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCurrency_code() {
        return this.currency_code;
    }

    public void setCurrency_code(String currency_code) {
        this.currency_code = currency_code;
    }

    public String getAccount_number() {
        return this.account_number;
    }

    public void setAccount_number(String account_number) {
        this.account_number = account_number;
    }

}
