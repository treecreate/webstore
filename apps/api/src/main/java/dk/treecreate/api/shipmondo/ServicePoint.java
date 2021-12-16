package dk.treecreate.api.shipmondo;

import dk.treecreate.api.shipmondo.utility.Address;

public class ServicePoint extends Address {
    private String id = "null";
    private String name = "null";

    /**
     * Blank class constructor
     */
    ServicePoint() { /* Blank Constructor */}

    /**
     * Class constructor with all attributes
     * @param id Identifier of the service point.
     * @param name Name of the service point.
     * @param address Address object with all relevant information
     */
    ServicePoint(String id, String name, Address address) {
        this.id = id;
        this.name = name;
        this.address1 = address.getAddress1();
        this.address2 = address.getAddress2();
        this.zipcode = address.getZipcode();
        this.city = address.getCity();
        this.country_code = address.getCountry_code();
    }

    // Getters and setters
    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
