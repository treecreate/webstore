package dk.treecreate.api.order;

import dk.treecreate.api.TestUtilsService;
import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerTests
{

    @MockBean
    AuthUserService authUserService;
    @Autowired
    private MockMvc mvc;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private OrderRepository orderRepository;

    @Nested
    class AuthenticationTests
    {
        @Test
        @DisplayName("GET /orders endpoint returns 401 when user credentials are invalid")
        void getOrdersReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            mvc.perform(get("/orders"))
                .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    class GetOrdersTests
    {
        @Test
        @DisplayName("GET /orders endpoint returns 403: Forbidden when called by ROLE_USER")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getOrdersReturnsForbiddenToRoleUser() throws Exception
        {
            mvc.perform(get("/orders"))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("GET /orders endpoint returns 400: Bad Request when userId param is invalid")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getOrdersReturnsBadRequestToInvalidParam() throws Exception
        {
            mvc.perform(get("/orders?userId=1"))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName(
            "GET /orders endpoint returns 404: Not Found when userId param points to not existant user")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void getOrdersReturnsNotFound() throws Exception
        {
            Mockito.when(userRepository.findByUserId(any())).thenReturn(Optional.empty());

            mvc.perform(get("/orders?userId=c0a80121-7adb-10c0-817a-dbc2f0ec1234"))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("GET /orders endpoint returns a list of orders")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void getOrdersReturnsListOfOrders() throws Exception
        {
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
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void getOrdersReturnsListOfOrdersFilteredByUser() throws Exception
        {
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
            Mockito.when(userRepository.findByUserId(any()))
                .thenReturn(Optional.of(user2));

            mvc.perform(get("/orders?userId=" + user2.getUserId()))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(filteredList)));
        }
    }
}
