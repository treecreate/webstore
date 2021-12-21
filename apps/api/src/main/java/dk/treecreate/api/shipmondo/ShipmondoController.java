package dk.treecreate.api.shipmondo;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dk.treecreate.api.shipmondo.dto.ShipmentObjectDto;
import dk.treecreate.api.shipmondo.shipment_object_components.Parcels;
import dk.treecreate.api.shipmondo.shipment_object_components.SendLabel;
import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;
import dk.treecreate.api.shipmondo.utility.DateAndTime;
import dk.treecreate.api.shipmondo.utility.Receiver;
import dk.treecreate.api.shipmondo.utility.Sender;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@CrossOrigin(origins = "*", maxAge = 3600) @RestController @RequestMapping()
public class ShipmondoController
{

    @GetMapping(path = "/create-shipment")
    public ResponseEntity<ShipmentObject> createShipment(/* Needs some serious params */) throws Exception
    {
        var receiverAddress = new Address("getAddress1", "getZipcode", "getCity", "DK");
        var receiverContact = new ContactInfo("Test contact", "", "", "52525252", "test@test.email");

        var parcels = new Parcels(1, 1000);
        var parcelsList = new ArrayList<Parcels>();
        parcelsList.add(parcels);

        var object = ShipmentObjectDto.createShipment("instruction", receiverContact, receiverAddress, parcelsList);


        return new ResponseEntity<>(object, HttpStatus.OK);
    }
}
