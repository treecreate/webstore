package dk.treecreate.api.shipmondo;

import dk.treecreate.api.shipmondo.ParcelsComponents.DangerousGoods;
import dk.treecreate.api.shipmondo.ParcelsComponents.DeclaredValue;
/**
 * Meant to be a complete package of one parcel. <p>
 * It is to be provided as a list with individual parcels to the ShipmentObject.
 */
public class Parcels {
    
    private int quantity;
    private int weight;           // Weight in grams    | Either use this or weight_kg
    private double weight_kg;     // Weight in in Kg    | Either use this or weight
    private int length;           // Length in CM
    private int width;            // Width in CM
    private int height;           // Height in CM
    private double volume;        // Cubic meter
    private double running_metre; // Running metre in metre
    private String description;
    private String packaging;
    private DangerousGoods dangerous_goods;
    private DeclaredValue declared_value;
    
    public Parcels() { /* Empty constructor */ }

    // Getters and setters
    public int getQuantity() {
        return this.quantity;
    }

    /** 
     * Minimum value is: <pre><code>1</code></pre>
     * If a value lower than the minimum is provided it will override it to: <pre><code>1</code></pre>
    */
    public void setQuantity(int quantity) {
        if (quantity >= 1) {
            this.quantity = quantity;
        } else {
            System.out.println("Minimum was less than one. Overriding to one."); // TODO - logger this
            this.quantity = 1;
        }
    }

    /**
     * Weight in grams. <p>
     */
    public int getWeight() {
        return this.weight;
    }

    /**
     * Weight in grams. <p>
     * Minimum weight is: <pre><code>1</code></pre>
     * If a value lower than the minimum is provided it will override it to: <pre><code>1</code></pre>
     */
    public void setWeight(int weight) {
        if (weight >= 1) {
            this.weight = weight;
        } else {
            System.out.println("Minimum was less than one. Overriding to one."); // TODO - logger this
            this.weight = 1;
        }
    }

    /**
     * Weight in Kg. <p>
     */
    public double getWeight_kg() {
        return this.weight_kg;
    }

    /**
     * Weight in Kg. <p>
     * Minimum weight is: <pre><code>0.001</code></pre>
     * If a value lower than the minimum is provided it will be overwritten to: <pre><code>0.001</code></pre> Kg
     */
    public void setWeight_kg(double weight_kg) {
        if (weight_kg >= 0.001) {
            this.weight_kg = weight_kg;
        } else {
            System.out.println("Minimum was less than 0.001 kg. Overriding to 0.001."); // TODO - logger this
            this.weight_kg = 0.001;
        }
    }

    /**
     * Length in Cm. <p>
     */
    public int getLength() {
        return this.length;
    }

    /**
     * Length in Cm. <p>
     * Minimum length is: <pre><code>1</code></pre>
     * If a value lower than the minimum is provided it will override it to: <pre><code>1</code></pre>
     */
    public void setLength(int length) {
        this.length = length;
    }

    /**
     * Width in Cm. <p>
     */
    public int getWidth() {
        return this.width;
    }
    
    /**
     * Width in Cm. <p>
     * Minimum width is: <pre><code>1</code></pre>
     * If a value lower than the minimum is provided it will override it to: <pre><code>1</code></pre>
     */
    public void setWidth(int width) {
        this.width = width;
    }

    /**
     * Height in Cm. <p>
     */
    public int getHeight() {
        return this.height;
    }

    /**
     * Height in Cm. <p>
     * Minimum height is: <pre><code>1</code></pre>
     * If a value lower than the minimum is provided it will override it to: <pre><code>1</code></pre>
     */
    public void setHeight(int height) {
        this.height = height;
    }


    /**
     * Volume in cubic metres. <p>
     */
    public double getVolume() {
        return this.volume;
    }

    /**
     * Volume in cubic metres. <p>
     * Minium value is: <pre><code>0.001</code></pre>
     * If a value lower than the minimum is provided it will override it to: <pre><code>0.001</code></pre>
     */
    public void setVolume(double volume) {
        this.volume = volume;
    }

    /**
     * Running metre in metres. <p>
     */
    public double getRunning_metre() {
        return this.running_metre;
    }

    /**
     * Running metre in metres. <p>
     * Minium value is: <pre><code>0.001</code></pre>
     * If a value lower than the minimum is provided it will override it to: <pre><code>0.001</code></pre>
     */
    public void setRunning_metre(double running_metre) {
        this.running_metre = running_metre;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    /**
     * Package type for the parcel. Must be a valid package type for the customer.
     */
    public String getPackaging() {
        return this.packaging;
    }

    /**
     * Package type for the parcel. Must be a valid package type for the customer.
     * Valid parcels are: [ TODO - FIND OUT ]
     */
    public void setPackaging(String packaging) {
        this.packaging = packaging;
    }

    public DangerousGoods getDangerous_goods() {
        return this.dangerous_goods;
    }

    public void setDangerous_goods(DangerousGoods dangerous_goods) {
        this.dangerous_goods = dangerous_goods;
    }

    public DeclaredValue getDeclared_value() {
        return this.declared_value;
    }

    public void setDeclared_value(DeclaredValue declared_value) {
        this.declared_value = declared_value;
    }
}
