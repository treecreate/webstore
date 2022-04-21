package dk.treecreate.api.order;

import dk.treecreate.api.contactinfo.ContactInfo;
import dk.treecreate.api.contactinfo.ContactInfoRepository;
import dk.treecreate.api.contactinfo.dto.UpdateContactInfoRequest;
import dk.treecreate.api.designs.Design;
import dk.treecreate.api.designs.DesignDimension;
import dk.treecreate.api.designs.DesignType;
import dk.treecreate.api.discount.Discount;
import dk.treecreate.api.discount.DiscountType;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import dk.treecreate.api.order.dto.UpdateOrderRequest;
import dk.treecreate.api.transactionitem.TransactionItem;
import dk.treecreate.api.utils.OrderStatus;
import dk.treecreate.api.utils.model.quickpay.ShippingMethod;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OrderServiceTest
{
    @Autowired
    OrderService orderService;

    @MockBean
    OrderRepository orderRepository;

    private static Stream<Arguments> verifyPriceArguments()
    {
        return Stream.of(
            // no discount, no more than 3. All valid sizes
            Arguments.of(1, new BigDecimal(998), new BigDecimal(998), 0, null, true, true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            Arguments.of(1, new BigDecimal(1398), new BigDecimal(1398), 0, null, true, true, true,
                2,
                DesignDimension.MEDIUM, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            Arguments.of(1, new BigDecimal(1998), new BigDecimal(1998), 0, null, true, true, true,
                2,
                DesignDimension.LARGE, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // no discount, no more than 3. All shipping options
            Arguments.of(1, new BigDecimal(998), new BigDecimal(998), 0, null, true, true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            Arguments.of(1, new BigDecimal(998), new BigDecimal(1023), 0, null, true, true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.HOME_DELIVERY,
                null),
            Arguments.of(1, new BigDecimal(998), new BigDecimal(1098), 0, null, true, true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.OWN_DELIVERY,
                null),
            // no discount, no more than 3, extra 5 planted trees
            Arguments.of(6, new BigDecimal(998), new BigDecimal(1048), 0, null, true, true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // Discount - Amount, 500. All sizes
            Arguments.of(1, new BigDecimal(998), new BigDecimal(498), 500, DiscountType.AMOUNT,
                true, true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            Arguments.of(1, new BigDecimal(1398), new BigDecimal(898), 500, DiscountType.AMOUNT,
                true, true, true, 2,
                DesignDimension.MEDIUM, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            Arguments.of(1, new BigDecimal(1998), new BigDecimal(1498), 500, DiscountType.AMOUNT,
                true, true, true, 2,
                DesignDimension.LARGE, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // Discount - Amount, 1000 (more than subtotal)
            Arguments.of(1, new BigDecimal(998), new BigDecimal(43), 1000, DiscountType.AMOUNT,
                true, true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // Discount - Amount, 0
            Arguments.of(1, new BigDecimal(998), new BigDecimal(998), 0, DiscountType.AMOUNT, true,
                true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // Discount - Percent, 10. All sizes
            Arguments.of(1, new BigDecimal(998), new BigDecimal("898.20"), 10, DiscountType.PERCENT,
                true, true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            Arguments.of(1, new BigDecimal(1398), new BigDecimal("1258.20"), 10,
                DiscountType.PERCENT,
                true, true, true, 2,
                DesignDimension.MEDIUM, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            Arguments.of(1, new BigDecimal(1998), new BigDecimal("1798.20"), 10,
                DiscountType.PERCENT,
                true, true, true, 2,
                DesignDimension.LARGE, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // Discount - percent. Off number resulting in a complex floating point
            Arguments.of(69, new BigDecimal(4756239), new BigDecimal("1475114.09"), 69,
                DiscountType.PERCENT, true, true, true, 69,
                DesignDimension.LARGE, 69, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // Discount - percent. Shipping - own delivery. Off number resulting in a
            // complex floating point
            Arguments.of(69, new BigDecimal(4756239), new BigDecimal("1475214.09"), 69,
                DiscountType.PERCENT, true, true, true, 69,
                DesignDimension.LARGE, 69, DesignType.FAMILY_TREE, ShippingMethod.OWN_DELIVERY,
                null),
            // Discount - Percent, 100
            Arguments.of(1, new BigDecimal(998), new BigDecimal(45), 100, DiscountType.PERCENT,
                true,
                true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // Discount - Percent, 0
            Arguments.of(1, new BigDecimal(998), new BigDecimal(998), 0, DiscountType.PERCENT, true,
                true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // hasMoreThan3 use case. Includes all sizes
            Arguments.of(1, new BigDecimal(1497), new BigDecimal(1497), 0, null, true, true, true,
                3,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            Arguments.of(1, new BigDecimal(1996), new BigDecimal(1497), 0, null, true, true,
                true, 4,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            Arguments.of(1, new BigDecimal(2495), new BigDecimal("1871.25"), 0, null, true, true,
                true, 5,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            Arguments.of(1, new BigDecimal(3495), new BigDecimal("2621.25"), 0, null, true, true,
                true, 5,
                DesignDimension.MEDIUM, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            Arguments.of(1, new BigDecimal(4995), new BigDecimal("3746.25"), 0, null, true, true,
                true, 5,
                DesignDimension.LARGE, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // no discount, more than 3. One item, but quantity of 4
            Arguments.of(1, new BigDecimal(1996), new BigDecimal(1497), 0, null, true, true,
                true, 1,
                DesignDimension.SMALL, 4, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // hasMoreThan3 with another discount (amount)
            Arguments.of(1, new BigDecimal(2495), new BigDecimal(2395), 100, DiscountType.AMOUNT,
                true, true, true,
                5, DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // hasMoreThan3 with another discount (percent)
            Arguments.of(1, new BigDecimal(2495), new BigDecimal("2245.50"), 10,
                DiscountType.PERCENT, true, true, true, 5, DesignDimension.SMALL, 1,
                DesignType.FAMILY_TREE,
                ShippingMethod.PICK_UP_POINT, null),
            // no transaction items
            Arguments.of(1, new BigDecimal(0), new BigDecimal(45), 0,
                null, true, true, true, 0, DesignDimension.SMALL, 1, DesignType.FAMILY_TREE,
                ShippingMethod.PICK_UP_POINT, null),
            // fail scenarios
            // Subtotal mismatch
            Arguments.of(1, new BigDecimal(666), new BigDecimal(499), 1,
                null, true, true, true, 0, DesignDimension.SMALL, 1, DesignType.FAMILY_TREE,
                ShippingMethod.PICK_UP_POINT,
                "does not match calculated subtotal"),
            // Total mismatch - no discounts
            Arguments.of(1, new BigDecimal(998), new BigDecimal(666), 0, null, true, true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                "does not match calculated total"),
            // Total mismatch - discount
            Arguments.of(1, new BigDecimal(998), new BigDecimal(666), 100, DiscountType.AMOUNT,
                true, true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                "does not match calculated total"),
            // Total mismatch - has more than 3
            Arguments.of(1, new BigDecimal(1996), new BigDecimal(666), 100, null, true, true, true,
                4,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                "does not match calculated total"),
            // throws error when trying to use dimension ONE_SIZE
            Arguments.of(1, new BigDecimal(990), new BigDecimal(990), 0, null, true, true, true, 2,
                DesignDimension.ONE_SIZE, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                "dimension data is not valid"),
            // throws error when trying to use a disabled discount
            Arguments.of(1, new BigDecimal(998), new BigDecimal("898.20"), 10, DiscountType.PERCENT,
                false, true, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // throws error when trying to use a discount that hasn't started yet
            Arguments.of(1, new BigDecimal(998), new BigDecimal("898.20"), 10, DiscountType.PERCENT,
                true, true, false, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null),
            // throws error when trying to use an expired discount
            Arguments.of(1, new BigDecimal(998), new BigDecimal("898.20"), 10, DiscountType.PERCENT,
                true, false, true, 2,
                DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                null));
    }

    private static Stream<Arguments> calculateTotalArguments()
    {
        return Stream.of(
            Arguments.of(new BigDecimal(499), 100, DiscountType.AMOUNT, false,
                new BigDecimal("399.00"), null),
            Arguments.of(new BigDecimal(499), 100, DiscountType.PERCENT, false,
                new BigDecimal("0.00"), null),
            Arguments.of(new BigDecimal(499), 50, DiscountType.PERCENT, false,
                new BigDecimal("249.50"), null),
            Arguments.of(new BigDecimal(499), 0, null, false, new BigDecimal("499.00"), null),
            Arguments.of(new BigDecimal(499), 0, null, true, new BigDecimal("374.25"), null));
    }

    private static Stream<Arguments> pricePerItemArguments()
    {
        return Stream.of(
            Arguments.of(DesignType.FAMILY_TREE, DesignDimension.SMALL, new BigDecimal(499), null),
            Arguments.of(DesignType.FAMILY_TREE, DesignDimension.MEDIUM, new BigDecimal(699), null),
            Arguments.of(DesignType.FAMILY_TREE, DesignDimension.LARGE, new BigDecimal(999), null),
            Arguments.of(DesignType.FAMILY_TREE, DesignDimension.ONE_SIZE, null,
                "dimension data is not valid"));
    }

    @ParameterizedTest
    @MethodSource("verifyPriceArguments")
    @DisplayName("verifyPrice() correctly validates pricing information")
    void verifyPrice(int plantedTrees, BigDecimal total, BigDecimal subTotal, int discountAmount,
                     DiscountType discountType, boolean discountIsEnabled, boolean expired,
                     boolean alreadyStarted, int itemCount, DesignDimension designDimension,
                     int designQuantity, DesignType designType, ShippingMethod shippingMethod,
                     String exceptionMessageSnippet)
    {
        // prepare the order
        Order order = new Order();
        order.setPlantedTrees(plantedTrees);
        order.setSubtotal(total);
        order.setTotal(subTotal);
        order.setShippingMethod(shippingMethod);

        // prepare the discount
        Discount discount = null;
        if (discountType != null)
        {
            discount = new Discount();
            discount.setAmount(discountAmount);
            discount.setType(discountType);
            discount.setIsEnabled(discountIsEnabled);
            Date date = new Date();
            Instant instant = date.toInstant();
            if (expired)
            {
                Instant newDate = instant.minus(2, ChronoUnit.DAYS);
                discount.setExpiresAt(Date.from(newDate));
            } else
            {
                Instant newDate = instant.plus(2, ChronoUnit.DAYS);
                discount.setExpiresAt(Date.from(newDate));
            }
            instant = date.toInstant();
            if (alreadyStarted)
            {
                Instant newDate = instant.minus(2, ChronoUnit.DAYS);
                discount.setExpiresAt(Date.from(newDate));
            } else
            {
                Instant newDate = instant.plus(2, ChronoUnit.DAYS);
                discount.setExpiresAt(Date.from(newDate));
            }
        }
        order.setDiscount(discount);

        // prepare the transaction items
        List<TransactionItem> items = new ArrayList<>();
        for (int i = 0; i < itemCount; i++)
        {
            var item = new TransactionItem();
            item.setDimension(designDimension);
            item.setQuantity(designQuantity);
            Design design = new Design();
            design.setDesignType(designType);
            item.setDesign(design);
            items.add(item);
        }
        order.setTransactionItems(items);

        // call the verifyPrice method
        if (exceptionMessageSnippet == null)
        {
            assertTrue(orderService.verifyPrice(order));
        } else
        {
            Throwable exception = assertThrows(ResponseStatusException.class, () -> {
                orderService.verifyPrice(order);
            });
            assertThat(exception.getMessage()).contains(exceptionMessageSnippet);
        }
    }

    @ParameterizedTest
    @MethodSource("calculateTotalArguments")
    @DisplayName("calculateTotal() correctly applies discounts to the subtotal")
    void calculateTotal(BigDecimal subTotal, int discountAmount, DiscountType discountType,
                        boolean hasMoreThan3, BigDecimal expectedTotal,
                        String exceptionMessageSnippet)
    {
        if (expectedTotal != null)
        {
            Discount discount = null;
            if (discountType != null)
            {
                discount = new Discount();
                discount.setType(discountType);
                discount.setAmount(discountAmount);
            }
            assertEquals(orderService.calculateTotal(subTotal, discount, hasMoreThan3),
                expectedTotal);
        } else
        {
            Throwable exception = assertThrows(ResponseStatusException.class, () -> {
                Discount discount = null;
                if (discountType != null)
                {
                    discount = new Discount();
                    discount.setType(discountType);
                    discount.setAmount(discountAmount);
                }
                orderService.calculateTotal(subTotal, discount, hasMoreThan3);
            });
            assertThat(exception.getMessage()).contains(exceptionMessageSnippet);
        }
    }

    @ParameterizedTest
    @MethodSource("pricePerItemArguments")
    @DisplayName("pricePerItem() correctly returns price based on design type and dimensions")
    void pricePerItem(DesignType designType, DesignDimension designDimension,
                      BigDecimal expectedPrice, String exceptionMessageSnippet)
    {
        // there is no point testing the default options sine they are impossible to
        // each as of now (there are not enum values not covered by the switches)
        if (expectedPrice != null)
        {
            assertEquals(orderService.pricePerItem(designType, designDimension), expectedPrice);
        } else
        {
            Throwable exception = assertThrows(ResponseStatusException.class, () -> {
                orderService.pricePerItem(designType, designDimension);
            });
            assertThat(exception.getMessage()).contains(exceptionMessageSnippet);
        }
    }

    @MockBean
    ContactInfoRepository contactInfoRepository;

    @Nested
    class UpdateOrderTests
    {
        @Test
        @DisplayName("updateOrder() correctly updates the contact info of the order")
        void updateOrderContactInfo()
        {
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
            Order newOrder = new Order();

            order.setOrderId(orderId); // contact info is null
            order.setStatus(
                OrderStatus.ASSEMBLING); // shouldn't change after update// shouldn't change after update
            order.setSubtotal(new BigDecimal(0));
            order.setTotal(new BigDecimal(0));
            order.setContactInfo(new ContactInfo());

            newOrder.setOrderId(orderId);
            newOrder.setContactInfo(contactInfo);
            newOrder.setStatus(OrderStatus.ASSEMBLING); // shouldn't change after update
            newOrder.setSubtotal(new BigDecimal(0));
            newOrder.setTotal(new BigDecimal(0));

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

            Mockito.when(orderRepository.findByOrderId(orderId)).thenReturn(Optional.of(order));
            Mockito.when(contactInfoRepository.save(contactInfo)).thenReturn(contactInfo);
            Mockito.when(orderRepository.save(order)).thenReturn(newOrder);

            assertEquals(newOrder, orderService.updateOrder(orderId, updateOrderRequest));
        }

        @Test
        @DisplayName("updateOrder() correctly updates the status of the order")
        void updateOrderStatus()
        {
            // prepare the order
            UUID orderId = UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234");
            OrderStatus status = OrderStatus.ASSEMBLING;
            OrderStatus newStatus = OrderStatus.NEW;

            Order order = new Order();
            Order newOrder = new Order();

            order.setOrderId(orderId);
            order.setStatus(status);

            newOrder.setOrderId(orderId);
            newOrder.setStatus(newStatus);

            var updateOrderRequest = new UpdateOrderRequest();
            updateOrderRequest.setStatus(status);

            Mockito.when(orderRepository.findByOrderId(orderId)).thenReturn(Optional.of(order));
            Mockito.when(orderRepository.save(order)).thenReturn(newOrder);

            assertEquals(newOrder, orderService.updateOrder(orderId, updateOrderRequest));
        }

        @Test
        @DisplayName("updateOrder() throws ResourceNotFoundException if no order is found")
        void updateOrderNotFoundException()
        {
            UUID orderId = UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234");
            var updateOrderRequest = new UpdateOrderRequest();
            updateOrderRequest.setStatus(OrderStatus.ASSEMBLING);

            Mockito.when(orderRepository.findByOrderId(orderId)).thenReturn(Optional.empty());

            assertThrows(ResourceNotFoundException.class,
                () -> orderService.updateOrder(orderId, updateOrderRequest));
        }
    }
}
