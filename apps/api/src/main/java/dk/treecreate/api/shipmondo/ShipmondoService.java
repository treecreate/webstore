package dk.treecreate.api.shipmondo;

import dk.treecreate.api.config.CustomPropertiesConfig;
import dk.treecreate.api.shipmondo.shipment_object_components.Parcels;
import dk.treecreate.api.shipmondo.shipment_object_components.SendLabel;
import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;
import dk.treecreate.api.shipmondo.utility.Receiver;
import dk.treecreate.api.shipmondo.utility.Sender;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.UnknownContentTypeException;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ShipmondoService {
  private static final Logger LOGGER = LoggerFactory.getLogger(ShipmondoService.class);

  @Autowired CustomPropertiesConfig customPropertiesConfig;

  static final Sender SENDER = Sender.treecreateDefault();
  static final SendLabel LABEL =
      new SendLabel("Teo of TreeCreate", "teodor_jonasson@hotmail.com", "a4_pdf");

  public ShipmentObject createShipmentObject(
      String instruction,
      boolean isHomeDelivery,
      Address address,
      ContactInfo contact,
      List<Parcels> parcelsList) {
    // Customer values - variable
    var receiverAddress =
        new Address(
            address.getAddress1(),
            address.getZipcode(),
            address.getCity(),
            address.getCountry_code());
    var receiverContact =
        new ContactInfo(
            contact.getName(),
            contact.getAttention(),
            contact.getTelephone(),
            contact.getMobile(),
            contact.getEmail());
    var receiver = new Receiver(instruction, receiverContact, receiverAddress);

    boolean testMode = true;
    // Shipment object
    return new ShipmentObject(testMode, isHomeDelivery, SENDER, receiver, parcelsList, LABEL);
  }

  /**
   * Send a ShipmentObject to Shipmondo and get the response back. It contains headers for security
   * auth
   *
   * @param shipment Completed shipment object
   * @return ShipmondoResponseObject
   */
  public ShipmentObjectResponse queryShipmondo(ShipmentObject shipment) {

    HttpHeaders headers = new HttpHeaders();
    RestTemplate restTemplate = new RestTemplate();

    var shipmondoUrl = customPropertiesConfig.getShipmondoUrl() + "/shipments";
    // NOTE: the token is format of Base64 encoded of `BASIC <base64 of username:password>`
    var shipmondoToken = customPropertiesConfig.getShipmondoToken();

    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", shipmondoToken);
    try {
      URI uri = new URI(shipmondoUrl);

      // TODO - inform user when the address is invalid etc
      HttpEntity<ShipmentObject> httpEntity = new HttpEntity<>(shipment, headers);
      return restTemplate.postForObject(uri, httpEntity, ShipmentObjectResponse.class);

    } catch (URISyntaxException | ResourceAccessException e) {
      LOGGER.error("The shipmondo URL was wrong.", e);
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid Shipmondo URI.");
    } catch (UnknownContentTypeException e) {
      LOGGER.error("Error occurred while processing the shipment.", e);
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR, "Unable to parse response");
    } catch (Exception e) {
      LOGGER.error("Unhandled exception occurred!", e);
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR, "Grab a coffee and lean back, the experts are on it.");
    }
  }
}
