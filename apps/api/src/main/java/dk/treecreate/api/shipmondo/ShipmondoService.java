package dk.treecreate.api.shipmondo;

import java.util.ArrayList;
import java.util.Arrays;

import org.springframework.stereotype.Service;

import dk.treecreate.api.shipmondo.shipment_object_components.Parcels;
import dk.treecreate.api.shipmondo.shipment_object_components.SendLabel;
import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;
import dk.treecreate.api.shipmondo.utility.PrintUtil;
import dk.treecreate.api.shipmondo.utility.Receiver;
import dk.treecreate.api.shipmondo.utility.Sender;

@Service
public class ShipmondoService {

    static final Sender SENDER = Sender.treecreateDefault();
    static final SendLabel LABEL = new SendLabel("Test label", "nyt604@gmail.com", "a4_pdf");

    public ShipmentObject createShipmentObject(String instruction, Address address, ContactInfo contact) {
        
        // TODO - remove
        PrintUtil.print("Instruction: " + instruction);
        PrintUtil.print("Address: " + address.toString());
        PrintUtil.print("Contact info: " + contact.toString());
        // ------------------

        // Customer values - variable
        var receiverAddress = new Address(address.getAddress1(), address.getZipcode(), address.getCity(), address.getCountry_code());
        var receiverContact = new ContactInfo(contact.getName(), contact.getAttention(), contact.getTelephone(), contact.getMobile(), contact.getEmail());
        var receiver = new Receiver(instruction, receiverContact, receiverAddress);

        // Shipment items
        var parcelsList = new ArrayList<>(Arrays.asList(new Parcels(1, 1000)));

        // Shipment object
        return new ShipmentObject(true, SENDER, receiver, parcelsList, LABEL);
    }
}
