package dk.treecreate.api.shipmondo.shipment_object_components;

import java.util.List;

import dk.treecreate.api.shipmondo.shipment_object_components.customs_components.Goods;

public class Customs {
    private String export_reason = "other";
    private String term_of_trade = "DAP";   // API states "int". Api is wrong.
    private String currency_code = "DKK";   // API states "int". Api is wrong.
    private List<Goods> goods;              // Array of Goods objects to be sent

    public Customs() { /* Blank class constructor */ }

    /**
     * Class constructor with all possible fields
     * @param export_reason Reason for exporting the goods. <p> 
     * Allowed values: ["sale_of_goods", "gift", "documents", "commercial_samples", "returned_goods", "other"]
     * @param term_of_trade Incoterm for the shipments i.e. DDP when customs should be payed by the sender. <p> Example: "DAP"
     * @param currency_code Currency code for prices declared in goods <p> Example: "DKK"
     * @param goods Array of Goods objects with all required data
     */
    public Customs(String export_reason, String term_of_trade, String currency_code, List<Goods> goods) {
        this.export_reason = export_reason;
        this.term_of_trade = term_of_trade;
        this.currency_code = currency_code;
        this.goods = goods;
    }

    // Getters and setters
    public String getExport_reason() {
        return this.export_reason;
    }

    public void setExport_reason(String export_reason) {
        this.export_reason = export_reason;
    }

    public String getTerm_of_trade() {
        return this.term_of_trade;
    }

    public void setTerm_of_trade(String term_of_trade) {
        this.term_of_trade = term_of_trade;
    }

    public String getCurrency_code() {
        return this.currency_code;
    }

    public void setCurrency_code(String currency_code) {
        this.currency_code = currency_code;
    }

    public List<Goods> getGoods() {
        return this.goods;
    }

    public void setGoods(List<Goods> goods) {
        this.goods = goods;
    }
    
}
