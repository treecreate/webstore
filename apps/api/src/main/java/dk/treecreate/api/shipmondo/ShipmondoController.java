package dk.treecreate.api.shipmondo;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.UnknownContentTypeException;
import org.springframework.web.server.ResponseStatusException;

import dk.treecreate.api.config.CustomPropertiesConfig;
import dk.treecreate.api.shipmondo.dto.ShipmentObjectDto;
import dk.treecreate.api.shipmondo.shipment_object_components.Parcels;
import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;

@CrossOrigin(origins = "*", maxAge = 3600) @RestController @RequestMapping()
public class ShipmondoController
{

    @PostMapping(path = "/create-shipment")
    public ResponseEntity<ShipmentObjectResponse> createShipment(/* Needs some serious params */) throws Exception
    {
        var receiverAddress = new Address("Kongens Nytorv 14", "1050", "Copenhagen", "DK");
        var receiverContact = new ContactInfo("Test contact", null, null, "52525252", "test@test.email");
        var parcelsList = new ArrayList<>(Arrays.asList(new Parcels(1, 1000)));

        var shipment = ShipmentObjectDto.createShipment("", receiverContact, receiverAddress, parcelsList);
        var response = queryShipmondo(shipment);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Autowired
    CustomPropertiesConfig customPropertiesConfig;

    private ShipmentObjectResponse queryShipmondo(ShipmentObject shipment)
    {

        HttpHeaders headers = new HttpHeaders();
        RestTemplate restTemplate = new RestTemplate();

        var shipmondoUrl = customPropertiesConfig.getShipmondoUrl();
        var shipmondoToken = customPropertiesConfig.getShipmondoToken();

        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", shipmondoToken);

        System.out.println(shipmondoUrl + shipmondoToken);
        try
        {
            URI uri = new URI(shipmondoUrl);

            HttpEntity<ShipmentObject> httpEntity = new HttpEntity<>(shipment, headers);
            return restTemplate.postForObject(uri, httpEntity, ShipmentObjectResponse.class);

        } catch (URISyntaxException | ResourceAccessException e)
        {
            System.err.println(e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid Shipmondo URI.");
        } catch (UnknownContentTypeException e)
        {
            System.err.println(e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to parse response");
        } catch (Exception e)
        {
            System.err.println(e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Whoops.");
        }
    }
}
