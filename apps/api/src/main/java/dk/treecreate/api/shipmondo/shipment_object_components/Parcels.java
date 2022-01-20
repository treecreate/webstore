package dk.treecreate.api.shipmondo.shipment_object_components;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import dk.treecreate.api.shipmondo.shipment_object_components.parcels_components.DangerousGoods;
import dk.treecreate.api.shipmondo.shipment_object_components.parcels_components.DeclaredValue;

/**
 * Meant to be a complete package of one parcel.
 * <p>
 * It is to be provided as a list with individual parcels to the ShipmentObject.
 * <p>
 * Each Parcels object is meant to represent one kind of package. Eg. one size of trees
 */
public class Parcels
{
    private static final Logger LOGGER = LoggerFactory.getLogger(Parcels.class);

    private int quantity;
    private int weight; // Weight in grams | Either use this or weight_kg
    private double weight_kg; // Weight in in Kg | Either use this or weight
    private int length; // Length in CM
    private int width; // Width in CM
    private int height; // Height in CM
    private double volume; // Cubic meter
    private double running_metre; // Running metre in metre
    private String description;
    private String packaging;
    private List<DangerousGoods> dangerous_goods;
    private DeclaredValue declared_value;

    /**
     * Empty class constructor
     */
    public Parcels()
    {
        /* Empty constructor */ }

    /**
     * Most likely to be used class constructor with required fields
     * 
     * @param quantity Number of parcels of this kind. Maximum quantity depends on the product.
     * @param weight Weight in grams.
     */
    public Parcels(int quantity, int weight)
    {
        this.quantity = quantity;
        this.weight = weight;
    }

    /**
     * Class constructor with all possible fields
     * 
     * @param quantity Number of parcels of this kind. Maximum quantity depends on the product.
     * @param weight Weight in gram. Use either this or weight kg.
     * @param weight_kg Weight in kilogram. Use either this or weight.
     * @param length Length in cm
     * @param width Width in cm
     * @param height Height in cm
     * @param volume Volume in cubic metre
     * @param running_metre Running metre in metre
     * @param description Describing the content of the parcel.
     * @param packaging Package type for the parcel. Must be a valid package type for the customer.
     * @param dangerous_goods DangerousGoods object with all required fields
     * @param declared_value Value of the goods in the parcel. Used in terms of insurance for certain carriers.
     */
    public Parcels(int quantity, int weight, double weight_kg, int length, int width, int height, double volume,
            double running_metre, String description, String packaging, List<DangerousGoods> dangerous_goods,
            DeclaredValue declared_value)
    {
        this.quantity = quantity;
        this.weight = weight;
        this.weight_kg = weight_kg;
        this.length = length;
        this.width = width;
        this.height = height;
        this.volume = volume;
        this.running_metre = running_metre;
        this.description = description;
        this.packaging = packaging;
        this.dangerous_goods = dangerous_goods;
        this.declared_value = declared_value;
    }

    // Getters and setters
    public int getQuantity()
    {
        return this.quantity;
    }

    /**
     * Minimum value is:
     * 
     * <pre>
     * <code>1</code>
     * </pre>
     * 
     * If a value lower than the minimum is provided it will override it to:
     * 
     * <pre>
     * <code>1</code>
     * </pre>
     */
    public void setQuantity(int quantity)
    {
        if (quantity >= 1)
        {
            this.quantity = quantity;
        } else
        {
            LOGGER.warn("Minimum was less than one. Overriding to one.");
            this.quantity = 1;
        }
    }

    /**
     * Weight in grams.
     * <p>
     */
    public int getWeight()
    {
        return this.weight;
    }

    /**
     * Weight in grams.
     * <p>
     * Minimum weight is:
     * 
     * <pre>
     * <code>1</code>
     * </pre>
     * 
     * If a value lower than the minimum is provided it will override it to:
     * 
     * <pre>
     * <code>1</code>
     * </pre>
     */
    public void setWeight(int weight)
    {
        if (weight >= 1)
        {
            this.weight = weight;
        } else
        {
            LOGGER.warn("Minimum was less than one. Overriding to one.");
            this.weight = 1;
        }
        this.weight_kg = (double) this.weight / 1_000;
    }

    /**
     * Weight in Kg.
     * <p>
     */
    public double getWeight_kg()
    {
        return this.weight_kg;
    }

    /**
     * Weight in Kg.
     * <p>
     * Minimum weight is:
     * 
     * <pre>
     * <code>0.001</code>
     * </pre>
     * 
     * If a value lower than the minimum is provided it will be overwritten to:
     * 
     * <pre>
     * <code>0.001</code>
     * </pre>
     * 
     * Kg
     */
    public void setWeight_kg(double weight_kg)
    {
        if (weight_kg >= 0.001)
        {
            this.weight_kg = weight_kg;
        } else
        {
            LOGGER.warn("Minimum was less than 0.001 kg. Overriding to 1.");
            this.weight_kg = 1;
        }
    }

    /**
     * Length in Cm.
     * <p>
     */
    public int getLength()
    {
        return this.length;
    }

    /**
     * Length in Cm.
     * <p>
     * Minimum length is:
     * 
     * <pre>
     * <code>1</code>
     * </pre>
     * 
     * If a value lower than the minimum is provided it will override it to:
     * 
     * <pre>
     * <code>1</code>
     * </pre>
     */
    public void setLength(int length)
    {
        this.length = length;
    }

    /**
     * Width in Cm.
     * <p>
     */
    public int getWidth()
    {
        return this.width;
    }

    /**
     * Width in Cm.
     * <p>
     * Minimum width is:
     * 
     * <pre>
     * <code>1</code>
     * </pre>
     * 
     * If a value lower than the minimum is provided it will override it to:
     * 
     * <pre>
     * <code>1</code>
     * </pre>
     */
    public void setWidth(int width)
    {
        this.width = width;
    }

    /**
     * Height in Cm.
     * <p>
     */
    public int getHeight()
    {
        return this.height;
    }

    /**
     * Height in Cm.
     * <p>
     * Minimum height is:
     * 
     * <pre>
     * <code>1</code>
     * </pre>
     * 
     * If a value lower than the minimum is provided it will override it to:
     * 
     * <pre>
     * <code>1</code>
     * </pre>
     */
    public void setHeight(int height)
    {
        this.height = height;
    }

    /**
     * Volume in cubic metres.
     * <p>
     */
    public double getVolume()
    {
        return this.volume;
    }

    /**
     * Volume in cubic metres.
     * <p>
     * Minium value is:
     * 
     * <pre>
     * <code>0.001</code>
     * </pre>
     * 
     * If a value lower than the minimum is provided it will override it to:
     * 
     * <pre>
     * <code>0.001</code>
     * </pre>
     */
    public void setVolume(double volume)
    {
        this.volume = volume;
    }

    /**
     * Running metre in metres.
     * <p>
     */
    public double getRunning_metre()
    {
        return this.running_metre;
    }

    /**
     * Running metre in metres.
     * <p>
     * Minium value is:
     * 
     * <pre>
     * <code>0.001</code>
     * </pre>
     * 
     * If a value lower than the minimum is provided it will override it to:
     * 
     * <pre>
     * <code>0.001</code>
     * </pre>
     */
    public void setRunning_metre(double running_metre)
    {
        this.running_metre = running_metre;
    }

    public String getDescription()
    {
        return this.description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    /**
     * Package type for the parcel. Must be a valid package type for the customer.
     */
    public String getPackaging()
    {
        return this.packaging;
    }

    /**
     * Package type for the parcel. Must be a valid package type for the customer. Valid parcels are: [ TODO - FIND OUT
     * ]
     */
    public void setPackaging(String packaging)
    {
        this.packaging = packaging;
    }

    public List<DangerousGoods> getDangerous_goods()
    {
        return this.dangerous_goods;
    }

    public void setDangerous_goods(List<DangerousGoods> dangerous_goods)
    {
        this.dangerous_goods = dangerous_goods;
    }

    public DeclaredValue getDeclared_value()
    {
        return this.declared_value;
    }

    public void setDeclared_value(DeclaredValue declared_value)
    {
        this.declared_value = declared_value;
    }

    @Override
    public String toString()
    {
        return "{" + " quantity='" + getQuantity() + "'" + ", weight='" + getWeight() + "'" + ", weight_kg='"
                + getWeight_kg() + "'" + ", length='" + getLength() + "'" + ", width='" + getWidth() + "'"
                + ", height='" + getHeight() + "'" + ", volume='" + getVolume() + "'" + ", running_metre='"
                + getRunning_metre() + "'" + ", description='" + getDescription() + "'" + ", packaging='"
                + getPackaging() + "'" + ", dangerous_goods='" + getDangerous_goods() + "'" + ", declared_value='"
                + getDeclared_value() + "'" + "}";
    }

}
