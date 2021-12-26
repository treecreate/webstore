package dk.treecreate.api.shipmondo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import dk.treecreate.api.shipmondo.shipment_object_components.Parcels;
import dk.treecreate.api.shipmondo.shipment_object_components.SendLabel;
import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;
import dk.treecreate.api.shipmondo.utility.PrintUtil;
import dk.treecreate.api.shipmondo.utility.Receiver;
import dk.treecreate.api.shipmondo.utility.Sender;

@Service
public class ShipmondoService
{

    static final Sender SENDER = Sender.treecreateDefault();
    static final SendLabel LABEL = new SendLabel("Teo of TreeCreate", "teodor_jonasson@hotmail.com", "a4_pdf");

    public ShipmentObject createShipmentObject(
            String instruction, 
            boolean isHomeDelivery,
            Address address, ContactInfo contact,
            List<Parcels> parcelsList
        )
    {
        // Customer values - variable
        var receiverAddress = new Address(address.getAddress1(), address.getZipcode(), address.getCity(),
                address.getCountry_code());
        var receiverContact = new ContactInfo(contact.getName(), contact.getAttention(), contact.getTelephone(),
                contact.getMobile(), contact.getEmail());
        var receiver = new Receiver(instruction, receiverContact, receiverAddress);


        boolean testMode = true;
        // Shipment object
        return new ShipmentObject(testMode, isHomeDelivery, SENDER, receiver, parcelsList, LABEL);
    }
}
