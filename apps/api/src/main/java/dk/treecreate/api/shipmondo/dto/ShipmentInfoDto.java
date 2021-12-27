package dk.treecreate.api.shipmondo.dto;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import dk.treecreate.api.shipmondo.shipment_object_components.Parcels;
import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;
import io.swagger.annotations.ApiModelProperty;


public class ShipmentInfoDto
{
    // Frontend does not currently use this.
    @ApiModelProperty(name = "Delivery information for carrier, if any.", example = "Place on doormat")
    private String instruction;

    @NotNull
    @ApiModelProperty(name = "Address object containing the required information", required = true)
    private Address address;

    @NotNull
    @ApiModelProperty(name = "Contact info object containing the required information", required = true)
    private ContactInfo contact;

    @NotEmpty
    @ApiModelProperty(name = "List of Parcel objects containing parcel information", required = true)
    private List<Parcels> parcels;

    @ApiModelProperty(name = "Flag for delivery to home or not", required = true)
    private boolean isHomeDelivery;

    // Getters and setters
    public String getInstruction()
    {
        return this.instruction;
    }

    public void setInstruction(String instruction)
    {
        this.instruction = instruction;
    }

    public Address getAddress()
    {
        return this.address;
    }

    public void setAddress(Address address)
    {
        this.address = address;
    }

    public ContactInfo getContact()
    {
        return this.contact;
    }

    public void setContact(ContactInfo contact)
    {
        this.contact = contact;
    }

    public List<Parcels> getParcels()
    {
        return this.parcels;
    }

    public void setParcels(List<Parcels> parcels)
    {
        this.parcels = parcels;
    }

    public boolean isIsHomeDelivery()
    {
        return this.isHomeDelivery;
    }

    public boolean getIsHomeDelivery()
    {
        return this.isHomeDelivery;
    }

    public void setIsHomeDelivery(boolean isHomeDelivery)
    {
        this.isHomeDelivery = isHomeDelivery;
    }
    
    @Override
    public String toString() {
        return "{" +
            " instruction='" + getInstruction() + "'" +
            ", address='" + getAddress() + "'" +
            ", contact='" + getContact() + "'" +
            ", parcels='" + getParcels() + "'" +
            ", isHomeDelivery='" + isIsHomeDelivery() + "'" +
            "}";
    }
}
