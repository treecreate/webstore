package dk.treecreate.api.shipmondo.shipment_object_components;

import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.DateAndTime;

/**
 * Pick up point for the package(s)
 */
public class PickUp extends Address
{
    private String name;
    private String attention;
    private String telephone;
    // Pickup instruction to the carrier. Only applicable for products which supports pickup instructions.
    private String instruction;
    private String date; // String with the Date format
    private String from_time; // Requested earliest delivery time
    private String to_time; // Requested latest delivery time

    /**
     * Blank class constructor
     */
    public PickUp()
    {
        /* Blank constructor */}

    /**
     * Class constructor with all possible fields
     * 
     * @param name
     * @param attention
     * @param telephone
     * @param instruction Pickup instruction to the carrier. Only applicable for products which supports pickup
     * instructions.
     * @param date Requested pickup date. must follow the Date format
     * @param from_time Requested earliest pickup time. must follow the Time format.
     * @param to_time Requested latest pickup time. must follow the Time format.
     * @param address Address object containing the pick up address
     */
    public PickUp(String name, String attention, String telephone, String instruction, DateAndTime dnt, Address address)
    {
        this.name = name;
        this.attention = attention;
        this.address1 = address.getAddress1();
        this.address2 = address.getAddress2();
        this.country_code = address.getCountry_code();
        this.zipcode = address.getCountry_code();
        this.city = address.getCity();
        this.telephone = telephone;
        this.instruction = instruction;
        this.date = dnt.getDate();
        this.from_time = dnt.getFrom_time();
        this.to_time = dnt.getTo_time();
    }

    // Getters and setters

    public String getName()
    {
        return this.name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getAttention()
    {
        return this.attention;
    }

    public void setAttention(String attention)
    {
        this.attention = attention;
    }

    public String getTelephone()
    {
        return this.telephone;
    }

    public void setTelephone(String telephone)
    {
        this.telephone = telephone;
    }

    public String getInstruction()
    {
        return this.instruction;
    }

    public void setInstruction(String instruction)
    {
        this.instruction = instruction;
    }

    public String getDate()
    {
        return this.date;
    }

    public void setDate(String date)
    {
        this.date = date;
    }

    public String getFrom_time()
    {
        return this.from_time;
    }

    public void setFrom_time(String from_time)
    {
        this.from_time = from_time;
    }

    public String getTo_time()
    {
        return this.to_time;
    }

    public void setTo_time(String to_time)
    {
        this.to_time = to_time;
    }

}
