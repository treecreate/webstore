package dk.treecreate.api.shipmondo;

public class QuoteObject {

    private String product_code;
    private String service_codes;
    private Sender sender;
    private Receiver receiver;
    private Parcels parcels;

    // Getters and setters

    /**
     *  Product code referring to which product should be quoted for.
     */
    public String getProduct_code() {
        return this.product_code;
    }

    /**
     *  Product code referring to which product should be quoted for.
     */
    public void setProduct_code(String product_code) {
        this.product_code = product_code;
    }
    /**
     * Comma-separated string of service codes referring to which services should be quoted for.
     */
    public String getService_codes() {
        return this.service_codes;
    }

    /**
     * Comma-separated string of service codes referring to which services should be quoted for.
     */
    public void setService_codes(String service_codes) {
        this.service_codes = service_codes;
    }

    /**
     * Sender address from which the shipment is quoted for.
     */
    public Sender getSender() {
        return this.sender;
    }

    /**
     * Sender address from which the shipment is quoted for.
     */
    public void setSender(Sender sender) {
        this.sender = sender;
    }

    /**
     * Receiver address from which the shipment is quoted for.
     */
    public Receiver getReceiver() {
        return this.receiver;
    }

    /**
     * Receiver address from which the shipment is quoted for.
     */
    public void setReceiver(Receiver receiver) {
        this.receiver = receiver;
    }

    /**
     * Array of objects.
     */
    public Parcels getParcels() {
        return this.parcels;
    }

    /**
     * Array of objects.
     */
    public void setParcels(Parcels parcels) {

        this.parcels = parcels;
    }

   
}
