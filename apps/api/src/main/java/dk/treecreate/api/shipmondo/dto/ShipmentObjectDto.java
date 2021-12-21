package dk.treecreate.api.shipmondo.dto;

import java.util.ArrayList;
import java.util.List;

import dk.treecreate.api.shipmondo.ShipmentObject;
import dk.treecreate.api.shipmondo.shipment_object_components.Parcels;
import dk.treecreate.api.shipmondo.shipment_object_components.SendLabel;
import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;
import dk.treecreate.api.shipmondo.utility.Receiver;
import dk.treecreate.api.shipmondo.utility.Sender;

public class ShipmentObjectDto
{

    public static ShipmentObject createShipment(String instruction, ContactInfo contact, Address address, List<Parcels> parcelsList) throws Exception
    {
        var sender = Sender.treecreateDefault();
        var receiver = new Receiver(instruction, contact, address);
        var label = new SendLabel("Test label", "nyt604@gmail.com", "a4_pdf");

        var object = new ShipmentObject(true, sender, receiver, parcelsList, label);

        System.out.println(object);
        return object;
        // Todo -- lots of things
    }
}
