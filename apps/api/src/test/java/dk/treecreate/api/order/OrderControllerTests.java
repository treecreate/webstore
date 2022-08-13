package dk.treecreate.api.order;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dk.treecreate.api.TestUtilsService;
import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.contactinfo.ContactInfo;
import dk.treecreate.api.contactinfo.ContactInfoRepository;
import dk.treecreate.api.contactinfo.dto.UpdateContactInfoRequest;
import dk.treecreate.api.mail.MailService;
import dk.treecreate.api.order.dto.CreateCustomOrderRequest;
import dk.treecreate.api.order.dto.UpdateOrderRequest;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import dk.treecreate.api.utils.OrderStatus;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerTests {

  @MockBean AuthUserService authUserService;
  @Autowired private MockMvc mvc;
  @MockBean private UserRepository userRepository;
  @MockBean private OrderRepository orderRepository;
  @MockBean private MailService mailService;

  @Nested
  class AuthenticationTests {
    @Test
    @DisplayName("GET /orders endpoint returns 401 when user credentials are invalid")
    void getOrdersReturnsUnauthorizedOnInvalidCredentials() throws Exception {
      mvc.perform(get("/orders")).andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("PATCH /orders/:orderId endpoint returns 401 when user credentials are invalid")
    void updateOrdersReturnsUnauthorizedOnInvalidCredentials() throws Exception {
      UUID uuid = new UUID(0, 0);
      mvc.perform(patch("/orders/" + uuid)).andExpect(status().isUnauthorized());
    }
  }

  @Nested
  class GetOrdersTests {
    @Test
    @DisplayName("GET /orders endpoint returns 403: Forbidden when called by ROLE_USER")
    @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
    void getOrdersReturnsForbiddenToRoleUser() throws Exception {
      mvc.perform(get("/orders")).andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /orders endpoint returns 400: Bad Request when userId param is invalid")
    @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
    void getOrdersReturnsBadRequestToInvalidParam() throws Exception {
      mvc.perform(get("/orders?userId=1")).andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName(
        "GET /orders endpoint returns 404: Not Found when userId param points to not existant user")
    @WithMockUser(
        username = "user@hotdeals.dev",
        password = "testPassword",
        roles = {"DEVELOPER"})
    void getOrdersReturnsNotFound() throws Exception {
      Mockito.when(userRepository.findByUserId(any())).thenReturn(Optional.empty());

      mvc.perform(get("/orders?userId=c0a80121-7adb-10c0-817a-dbc2f0ec1234"))
          .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /orders endpoint returns a list of orders")
    @WithMockUser(
        username = "user@hotdeals.dev",
        password = "testPassword",
        roles = {"DEVELOPER"})
    void getOrdersReturnsListOfOrders() throws Exception {
      User user1 = new User();
      user1.setUserId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234"));
      User user2 = new User();
      user2.setUserId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235"));
      List<Order> orderList = new ArrayList<>();
      orderList.add(new Order());
      orderList.get(0).setUserId(user1.getUserId());
      orderList.add(new Order());
      orderList.get(1).setUserId(user2.getUserId());

      Mockito.when(orderRepository.findAll()).thenReturn(orderList);

      mvc.perform(get("/orders"))
          .andExpect(status().isOk())
          .andExpect(content().json(TestUtilsService.asJsonString(orderList)));
    }

    @Test
    @DisplayName("GET /orders?userId endpoint returns a list of orders filtered by user")
    @WithMockUser(
        username = "user@hotdeals.dev",
        password = "testPassword",
        roles = {"DEVELOPER"})
    void getOrdersReturnsListOfOrdersFilteredByUser() throws Exception {
      User user1 = new User();
      user1.setUserId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234"));
      User user2 = new User();
      user2.setUserId(UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1235"));
      List<Order> orderList = new ArrayList<>();
      orderList.add(new Order());
      orderList.get(0).setUserId(user1.getUserId());
      orderList.add(new Order());
      orderList.get(1).setUserId(user2.getUserId());
      List<Order> filteredList = new ArrayList<>();
      filteredList.add(orderList.get(1));

      Mockito.when(orderRepository.findByUserId(any())).thenReturn(filteredList);
      // redundant mock in case the param check fails and tries to use findAll()
      Mockito.when(orderRepository.findAll()).thenReturn(orderList);
      Mockito.when(userRepository.findByUserId(any())).thenReturn(Optional.of(user2));

      mvc.perform(get("/orders?userId=" + user2.getUserId()))
          .andExpect(status().isOk())
          .andExpect(content().json(TestUtilsService.asJsonString(filteredList)));
    }
  }

  @Nested
  class UpdateOrderTests {
    @MockBean ContactInfoRepository contactInfoRepository;

    @Test
    @DisplayName("PATCH /orders/:orderId endpoint returns 403: Forbidden when called by ROLE_USER")
    @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
    void updateOrdersReturnsForbiddenToRoleUser() throws Exception {
      UUID uuid = new UUID(0, 0);
      mvc.perform(patch("/orders/" + uuid)).andExpect(status().isForbidden());
    }

    @Test
    @DisplayName(
        "PATCH /orders/:orderId endpoint returns 400: Bad Request when orderId param is invalid")
    @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
    void updateOrdersReturnsBadRequestToInvalidParam() throws Exception {
      mvc.perform(patch("/orders/123")).andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName(
        "PATCH /orders/:orderId endpoint returns 404: Not Found when orderId param points to not existant order")
    @WithMockUser(
        username = "user@hotdeals.dev",
        password = "testPassword",
        roles = {"DEVELOPER"})
    void updateOrdersReturnsNotFound() throws Exception {
      UUID uuid = new UUID(0, 0);
      Mockito.when(orderRepository.findByOrderId(any())).thenReturn(Optional.empty());

      mvc.perform(patch("/orders/" + uuid)).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName(
        "PATCH /orders/:orderId endpoint returns an unchanged order when request body is empty")
    @WithMockUser(
        username = "user@hotdeals.dev",
        password = "testPassword",
        roles = {"DEVELOPER"})
    void updateOrdersReturnsUnchangedOrderForEmptyBody() throws Exception {
      // prepare the order
      UUID orderId = UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234");

      ContactInfo contactInfo = new ContactInfo();
      contactInfo.setContactInfoId(new UUID(0, 0));
      contactInfo.setName("tester");
      contactInfo.setEmail("test@example.com");
      contactInfo.setPhoneNumber("4512345678");
      contactInfo.setStreetAddress("Testgade 123");
      contactInfo.setStreetAddress2("1st floor");
      contactInfo.setCity("Testhavn");
      contactInfo.setPostcode("1234");
      contactInfo.setCountry("Testevnia");

      Order order = new Order();

      order.setOrderId(orderId); // contact info is null
      order.setStatus(
          OrderStatus.ASSEMBLING); // shouldn't change after update// shouldn't change after update
      order.setSubtotal(new BigDecimal(0));
      order.setTotal(new BigDecimal(0));
      order.setContactInfo(new ContactInfo());

      Mockito.when(orderRepository.findByOrderId(orderId)).thenReturn(Optional.of(order));

      mvc.perform(patch("/orders/" + orderId))
          .andExpect(status().isOk())
          .andExpect(content().json(TestUtilsService.asJsonString(order)));
    }

    @Test
    @DisplayName("PATCH /orders/:orderId endpoint returns an updated order")
    @WithMockUser(
        username = "user@hotdeals.dev",
        password = "testPassword",
        roles = {"DEVELOPER"})
    void updateOrdersReturnsUpdatedOrder() throws Exception {
      // prepare the order
      UUID orderId = UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234");

      ContactInfo contactInfo = new ContactInfo();
      contactInfo.setContactInfoId(new UUID(0, 0));
      contactInfo.setName("tester");
      contactInfo.setEmail("test@example.com");
      contactInfo.setPhoneNumber("4512345678");
      contactInfo.setStreetAddress("Testgade 123");
      contactInfo.setStreetAddress2("1st floor");
      contactInfo.setCity("Testhavn");
      contactInfo.setPostcode("1234");
      contactInfo.setCountry("Testevnia");

      Order order = new Order();
      Order updatedOrder = new Order();

      order.setOrderId(orderId); // contact info is null
      order.setStatus(OrderStatus.ASSEMBLING);
      order.setSubtotal(new BigDecimal(0));
      order.setTotal(new BigDecimal(0));
      order.setContactInfo(contactInfo);
      order.setBillingInfo(contactInfo);

      updatedOrder.setOrderId(orderId);
      updatedOrder.setContactInfo(contactInfo);
      updatedOrder.setStatus(OrderStatus.NEW);
      updatedOrder.setBillingInfo(contactInfo);
      updatedOrder.setSubtotal(new BigDecimal(0));
      updatedOrder.setTotal(new BigDecimal(0));

      var updateOrderRequest = new UpdateOrderRequest();
      var updateContactInfoRequest = new UpdateContactInfoRequest();
      updateContactInfoRequest.setName(contactInfo.getName());
      updateContactInfoRequest.setEmail(contactInfo.getEmail());
      updateContactInfoRequest.setPhoneNumber(contactInfo.getPhoneNumber());
      updateContactInfoRequest.setStreetAddress(contactInfo.getStreetAddress());
      updateContactInfoRequest.setStreetAddress2(contactInfo.getStreetAddress2());
      updateContactInfoRequest.setCity(contactInfo.getCity());
      updateContactInfoRequest.setPostcode(contactInfo.getPostcode());
      updateContactInfoRequest.setCountry(contactInfo.getCountry());
      updateOrderRequest.setContactInfo(updateContactInfoRequest);
      updateOrderRequest.setStatus(OrderStatus.NEW);

      Mockito.when(orderRepository.findByOrderId(orderId)).thenReturn(Optional.of(order));
      Mockito.when(contactInfoRepository.save(any())).thenReturn(contactInfo);
      Mockito.when(orderRepository.save(any())).thenReturn(updatedOrder);

      mvc.perform(
              patch("/orders/" + orderId)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(TestUtilsService.asJsonString(updateOrderRequest)))
          .andExpect(status().isOk())
          .andExpect(content().json(TestUtilsService.asJsonString(updatedOrder)));
    }
  }

  @Nested
  class CreateCustomOrder {
    @Test
    @DisplayName("POST /orders/custom endpoint returns 400: Bad Request on missing request body")
    void getOrdersReturnsBadRequestToMissingRequestBody() throws Exception {
      mvc.perform(post("/orders/custom")).andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /orders/custom endpoint returns 400: Bad Request on invalid request body")
    void getOrdersReturnsBadRequestToInvalidRequestBody() throws Exception {
      CreateCustomOrderRequest request = new CreateCustomOrderRequest();

      mvc.perform(
              post("/orders/custom")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(TestUtilsService.asJsonString(request)))
          .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /orders/custom endpoint returns 204: Accepted on valid request")
    void getOrdersReturnsAcceptedOnValidRequestBody() throws Exception {
      Mockito.doNothing().when(mailService).sendCustomOrderRequestEmail(any());
      ;

      String name = "Api Test custom order";
      String email = "test@example.com";
      String description = "getOrdersReturnsAcceptedOnValidRequestBody";

      MockMultipartFile image1 =
          new MockMultipartFile(
              "images", "test.txt", MediaType.TEXT_PLAIN_VALUE, "Hello, World!".getBytes());
      MockMultipartFile image2 =
          new MockMultipartFile(
              "images", "test.txt", MediaType.TEXT_PLAIN_VALUE, "Hello, World!".getBytes());

      mvc.perform(
              multipart("/orders/custom")
                  .file(image1)
                  .file(image1)
                  .param("name", name)
                  .param("email", email)
                  .param("description", description)
                  .accept(MediaType.MULTIPART_FORM_DATA))
          .andExpect(status().isAccepted());
    }
  }
}
