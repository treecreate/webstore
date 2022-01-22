package dk.treecreate.api.shipmondo;

import dk.treecreate.api.TestUtilsService;
import dk.treecreate.api.shipmondo.dto.ShipmentInfoDto;
import dk.treecreate.api.shipmondo.shipment_object_components.Parcels;
import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.ContactInfo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class ShipmondoControllerTest
{

    @Autowired
    private MockMvc mvc;

    @Nested
    class AuthenticationTests
    {
        @Test
        @DisplayName(
            "POST /shipmondo/create-shipment endpoint returns 401 when user credentials are invalid")
        void postCreateShipmentReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            mvc.perform(post("/shipmondo/create-shipment"))
                .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    class CreateShipmentTests
    {
        @Test
        @DisplayName(
            "POST /shipmondo/create-shipment endpoint returns 403: Forbidden when called by ROLE_USER")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void postCreateShipmentReturnsForbiddenToRoleUser() throws Exception
        {
            ShipmentInfoDto shipmentInfoDto = new ShipmentInfoDto();
            shipmentInfoDto.setAddress(new Address());
            shipmentInfoDto.setContact(new ContactInfo());
            List<Parcels> parcelsList = new ArrayList<>();
            parcelsList.add(new Parcels());
            shipmentInfoDto.setParcels(parcelsList);
            shipmentInfoDto.setIsHomeDelivery(false);

            mvc.perform(post("/shipmondo/create-shipment")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtilsService.asJsonString(shipmentInfoDto)))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName(
            "POST /shipmondo/create-shipment endpoint returns 400: Bad Request when request body is empty")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void postCreateShipmentReturnsBadRequestToEmptyBody() throws Exception
        {
            mvc.perform(post("/shipmondo/create-shipment"))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName(
            "POST /shipmondo/create-shipment endpoint returns 400: Bad Request when request body is invalid")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void postCreateShipmentReturnsBadRequestToInvalidBody() throws Exception
        {
            mvc.perform(post("/shipmondo/create-shipment")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtilsService.asJsonString("{}")))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName(
            "POST /shipmondo/create-shipment endpoint returns 200: Sipment object response")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void postCreateShipmentReturnsShipmentResponse() throws Exception
        {
            ShipmentInfoDto shipmentInfoDto = new ShipmentInfoDto();

//            mvc.perform(post("/shipmondo/create-shipment")
//                    .contentType(MediaType.APPLICATION_JSON)
//                    .content(TestUtilsService.asJsonString(shipmentInfoDto)))
//                .andExpect(status().isOk());
        }
    }

}
