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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.UnknownContentTypeException;
import org.springframework.web.server.ResponseStatusException;

import dk.treecreate.api.config.CustomPropertiesConfig;
import dk.treecreate.api.shipmondo.dto.ShipmentObjectDto;
import dk.treecreate.api.shipmondo.ShipmentObject;
import dk.treecreate.api.shipmondo.shipment_object_components.Parcels;
import dk.treecreate.api.shipmondo.shipment_object_components.SendLabel;
import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;
import dk.treecreate.api.shipmondo.utility.Receiver;
import dk.treecreate.api.shipmondo.utility.Sender;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/shipmondo")
public class ShipmondoController
{

    @Autowired
    ShipmondoService service;

    @PostMapping(path = "/create-shipment")
    public ResponseEntity<ShipmentObjectResponse> createShipment(
            @RequestBody String instruction,
            @RequestBody Address address,
            @RequestBody ContactInfo contact
        )
    {

        var shipment = service.createShipmentObject(instruction, address, contact);

        // Shipmondo query
        var response = queryShipmondo(shipment);

        // Return response from Shipmondo
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
