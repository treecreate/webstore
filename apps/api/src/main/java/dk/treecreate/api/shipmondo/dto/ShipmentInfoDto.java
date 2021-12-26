package dk.treecreate.api.shipmondo.dto;

import javax.validation.constraints.NotNull;

import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;


public class ShipmentInfoDto
{
    
    private String instruction;
    @NotNull
    private Address address;
    @NotNull
    private ContactInfo contact;

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

}
