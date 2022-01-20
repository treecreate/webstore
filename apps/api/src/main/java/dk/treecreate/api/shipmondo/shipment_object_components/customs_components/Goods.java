package dk.treecreate.api.shipmondo.shipment_object_components.customs_components;

public class Goods {
    private int quantity;
    private String country;
    private String content;
    private String commodity_code;
    private double unit_value;
    private int unit_weight;

    public Goods() { /* Black class constructor */ }

    /**
     * Class constructor with all possible values
     * @param quantity Example: 2
     * @param country Example: "CN"
     * @param content Example: "Textile shirt"
     * @param commodity_code Classification numbers for goods. For more visit vita.skat.dk <p>
     * Example: "8471000000"
     * @param unit_value Unit value in declared currency <p> Example: 50.75
     * @param unit_weight Unit weight in gram <p> Example: 100
     */
    public Goods(int quantity, String country, String content, String commodity_code, double unit_value, int unit_weight) {
        this.quantity = quantity;
        this.country = country;
        this.content = content;
        this.commodity_code = commodity_code;
        this.unit_value = unit_value;
        this.unit_weight = unit_weight;
    }
    // Getters and setters
    public int getQuantity() {
        return this.quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getCountry() {
        return this.country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCommodity_code() {
        return this.commodity_code;
    }

    public void setCommodity_code(String commodity_code) {
        this.commodity_code = commodity_code;
    }

    public double getUnit_value() {
        return this.unit_value;
    }

    public void setUnit_value(double unit_value) {
        this.unit_value = unit_value;
    }

    public int getUnit_weight() {
        return this.unit_weight;
    }

    public void setUnit_weight(int unit_weight) {
        this.unit_weight = unit_weight;
    }

    
}
