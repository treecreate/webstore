package dk.treecreate.api.shipmondo;

import java.net.URI;
import java.net.URISyntaxException;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import dk.treecreate.api.shipmondo.dto.ShipmentInfoDto;
import dk.treecreate.api.shipmondo.utility.PrintUtil;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/shipmondo")
@PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
public class ShipmondoController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(ShipmondoController.class);

    @Autowired
    ShipmondoService service;

    /**
     * Create a shipmondo shipment and send the label via email to the email defined in LABEL
     * @param infoDto Dto with all necessary information
     * @return Shipmondo response object
     */
    @PostMapping(path = "/create-shipment")
    public ResponseEntity<ShipmentObjectResponse> createShipment(@RequestBody @Valid ShipmentInfoDto infoDto)
    {

        var shipment = service.createShipmentObject(infoDto.getInstruction(), infoDto.getIsHomeDelivery(), infoDto.getAddress(), infoDto.getContact(), infoDto.getParcels());

        // Shipmondo query
        var response = queryShipmondo(shipment);

        // Return response from Shipmondo
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    
    @Autowired
    CustomPropertiesConfig customPropertiesConfig;

    /**
     * Send a ShipmentObject to Shipmondo and get the response back. 
     * It contains headers for security auth
     * @param shipment Completed shipment object
     * @return ShipmondoResponseObject
     */
    private ShipmentObjectResponse queryShipmondo(ShipmentObject shipment)
    {

        HttpHeaders headers = new HttpHeaders();
        RestTemplate restTemplate = new RestTemplate();

        var shipmondoUrl = customPropertiesConfig.getShipmondoUrl();
        var shipmondoToken = customPropertiesConfig.getShipmondoToken();

        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", shipmondoToken);
        try
        {
            URI uri = new URI(shipmondoUrl);

            HttpEntity<ShipmentObject> httpEntity = new HttpEntity<>(shipment, headers);
            return restTemplate.postForObject(uri, httpEntity, ShipmentObjectResponse.class);

        } catch (URISyntaxException | ResourceAccessException e)
        {
            LOGGER.error("The shipmondo URL was wrong.", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid Shipmondo URI.");
        } catch (UnknownContentTypeException e)
        {
            LOGGER.error("Error occurred while processing the shipment.", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to parse response");
        } catch (Exception e)
        {
            LOGGER.error("Unhandled exception occurred!", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Grab a coffee and lean back, the experts are on it.");
        }
    }
}
