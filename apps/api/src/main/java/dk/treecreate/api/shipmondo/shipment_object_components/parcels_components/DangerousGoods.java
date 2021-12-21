package dk.treecreate.api.shipmondo.shipment_object_components.parcels_components;

public class DangerousGoods {
   
    private String ard_class;
    private String un_number;
    private int net_weight;
    private int net_weight_kg;
    private int quantity;
    private String packaging;
    private String description;
    private String tunnel_restriction_code;
    private String packaging_group;
    private boolean environmentally_hazardous;

    // Getters and setters 
    public String getArd_class() {
        return this.ard_class;
    }

    public void setArd_class(String ard_class) {
        this.ard_class = ard_class;
    }

    public String getUn_number() {
        return this.un_number;
    }

    public void setUn_number(String un_number) {
        this.un_number = un_number;
    }

    public int getNet_weight() {
        return this.net_weight;
    }

    public void setNet_weight(int net_weight) {
        this.net_weight = net_weight;
    }

    public int getNet_weight_kg() {
        return this.net_weight_kg;
    }

    public void setNet_weight_kg(int net_weight_kg) {
        this.net_weight_kg = net_weight_kg;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getPackaging() {
        return this.packaging;
    }

    public void setPackaging(String packaging) {
        this.packaging = packaging;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTunnel_restriction_code() {
        return this.tunnel_restriction_code;
    }

    public void setTunnel_restriction_code(String tunnel_restriction_code) {
        this.tunnel_restriction_code = tunnel_restriction_code;
    }

    public String getPackaging_group() {
        return this.packaging_group;
    }

    public void setPackaging_group(String packaging_group) {
        this.packaging_group = packaging_group;
    }

    public boolean isEnvironmentally_hazardous() {
        return this.environmentally_hazardous;
    }

    public void setEnvironmentally_hazardous(boolean environmentally_hazardous) {
        this.environmentally_hazardous = environmentally_hazardous;
    }


}
