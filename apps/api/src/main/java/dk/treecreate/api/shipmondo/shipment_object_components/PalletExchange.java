package dk.treecreate.api.shipmondo.shipment_object_components;

/**
 * Object to represent the pallets the user wishes to exchange
 */
public class PalletExchange {
    
    private int pallets1;
    private int pallets2;
    private int pallets4;

    public PalletExchange() { /* Blank class constructor */ }

    /**
     * Class constructor with all possible parameters
     * @param pallets1 The number of full pallets to exchange
     * @param pallets2 The number of half pallets to exchange
     * @param pallets4 The number of quarter pallets to exchange
     */
    public PalletExchange(int pallets1, int pallets2, int pallets4) {
        this.pallets1 = pallets1;
        this.pallets2 = pallets2;
        this.pallets4 = pallets4;
    }

    // Getters and setters
    public int getPallets1() {
        return this.pallets1;
    }

    public void setPallets1(int pallets1) {
        this.pallets1 = pallets1;
    }

    public int getPallets2() {
        return this.pallets2;
    }

    public void setPallets2(int pallets2) {
        this.pallets2 = pallets2;
    }

    public int getPallets4() {
        return this.pallets4;
    }

    public void setPallets4(int pallets4) {
        this.pallets4 = pallets4;
    }

}
