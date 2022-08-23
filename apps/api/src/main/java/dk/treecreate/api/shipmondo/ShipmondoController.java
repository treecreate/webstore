package dk.treecreate.api.shipmondo;

import dk.treecreate.api.shipmondo.dto.ShipmentInfoDto;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/shipmondo")
public class ShipmondoController {
  private static final Logger LOGGER = LoggerFactory.getLogger(ShipmondoController.class);

  @Autowired ShipmondoService service;

  /**
   * Create a shipmondo shipment and send the label via email to the email defined in LABEL
   *
   * @param infoDto Dto with all necessary information
   * @return Shipmondo response object
   */
  @PostMapping(path = "/create-shipment")
  @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
  public ShipmentObjectResponse createShipment(@RequestBody @Valid ShipmentInfoDto infoDto) {

    var shipment =
        service.createShipmentObject(
            infoDto.getInstruction(),
            infoDto.getIsHomeDelivery(),
            infoDto.getAddress(),
            infoDto.getContact(),
            infoDto.getParcels());

    return service.queryShipmondo(shipment);
  }
}
