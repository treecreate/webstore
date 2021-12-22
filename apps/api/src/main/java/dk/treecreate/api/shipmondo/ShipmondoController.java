package dk.treecreate.api.shipmondo;

import java.net.URI;
import java.util.ArrayList;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import dk.treecreate.api.shipmondo.dto.ShipmentObjectDto;
import dk.treecreate.api.shipmondo.shipment_object_components.Parcels;
import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;
import dk.treecreate.api.shipmondo.utility.PrintUtil;

@CrossOrigin(origins = "*", maxAge = 3600) @RestController @RequestMapping()
public class ShipmondoController
{

    @PostMapping(path = "/create-shipment")
    public ResponseEntity<ShipmentObjectResponse> createShipment(/* Needs some serious params */) throws Exception
    {
        var receiverAddress = new Address("Kongens Nytorv 14", "1050", "Copenhagen", "DK");
        var receiverContact = new ContactInfo("Test contact", null, null, "52525252", "test@test.email");

        var parcels = new Parcels(1, 1000);
        var parcelsList = new ArrayList<Parcels>();
        parcelsList.add(parcels);

        var object = ShipmentObjectDto.createShipment("", receiverContact, receiverAddress, parcelsList);

        try
        {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization",
                    "");
            URI uri = new URI("https://app.shipmondo.com/api/public/v3/shipments");

            HttpEntity<ShipmentObject> httpEntity = new HttpEntity<>(object, headers);

            RestTemplate restTemplate = new RestTemplate();
            var response = restTemplate.postForObject(uri, httpEntity, ShipmentObjectResponse.class);
            System.out.println(response);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e)
        {
            System.err.println("Its a no go buddy!\n" + e);
            throw e;
        }
    }
}
