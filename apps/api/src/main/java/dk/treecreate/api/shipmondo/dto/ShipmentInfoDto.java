package dk.treecreate.api.shipmondo.dto;

import java.util.List;

import javax.validation.constraints.NotNull;

import dk.treecreate.api.shipmondo.shipment_object_components.Parcels;
import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;


public class ShipmentInfoDto
{
    
    private String instruction;
    @NotNull
    private Address address;
    @NotNull
    private ContactInfo contact;
    private List<Parcels> parcels;

    // Getters and setters
    public String getInstruction() {
        return this.instruction;
    }

    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }

    public Address getAddress() {
        return this.address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public ContactInfo getContact() {
        return this.contact;
    }

    public void setContact(ContactInfo contact) {
        this.contact = contact;
    }

    public List<Parcels> getParcels() {
        return this.parcels;
    }

    public void setParcels(List<Parcels> parcels) {
        this.parcels = parcels;
    }

}
