package dk.treecreate.api.order;

import dk.treecreate.api.designs.Design;
import dk.treecreate.api.designs.DesignDimension;
import dk.treecreate.api.designs.DesignType;
import dk.treecreate.api.discount.Discount;
import dk.treecreate.api.discount.DiscountType;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import dk.treecreate.api.transactionitem.TransactionItem;
import dk.treecreate.api.utils.OrderStatus;
import dk.treecreate.api.utils.model.quickpay.ShippingMethod;
import org.junit.jupiter.api.DisplayName;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
class OrderServiceTest {
    @Autowired
    OrderService orderService;

    @MockBean
    OrderRepository orderRepository;

    private static Stream<Arguments> verifyPriceArguments() {
        return Stream.of(
                // no discount, no more than 3. All valid sizes
                Arguments.of(1, new BigDecimal(990), new BigDecimal(990), 0, null, 2,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                Arguments.of(1, new BigDecimal(1390), new BigDecimal(1390), 0, null, 2,
                        DesignDimension.MEDIUM, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                Arguments.of(1, new BigDecimal(1990), new BigDecimal(1990), 0, null, 2,
                        DesignDimension.LARGE, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                // no discount, no more than 3. All shipping options
                Arguments.of(1, new BigDecimal(990), new BigDecimal(990), 0, null, 2,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                Arguments.of(1, new BigDecimal(990), new BigDecimal(1019), 0, null, 2,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.HOME_DELIVERY,
                        null),
                Arguments.of(1, new BigDecimal(990), new BigDecimal(1090), 0, null, 2,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.OWN_DELIVERY,
                        null),
                // no discount, no more than 3, extra 5 planted trees
                Arguments.of(6, new BigDecimal(990), new BigDecimal(1040), 0, null, 2,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                // Discount - Amount, 500. All sizes
                Arguments.of(1, new BigDecimal(990), new BigDecimal(490), 500, DiscountType.AMOUNT, 2,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                Arguments.of(1, new BigDecimal(1390), new BigDecimal(890), 500, DiscountType.AMOUNT, 2,
                        DesignDimension.MEDIUM, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                Arguments.of(1, new BigDecimal(1990), new BigDecimal(1490), 500, DiscountType.AMOUNT, 2,
                        DesignDimension.LARGE, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                // Discount - Amount, 1000 (more than subtotal)
                Arguments.of(1, new BigDecimal(990), new BigDecimal(-10), 1000, DiscountType.AMOUNT, 2,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                // Discount - Amount, 0
                Arguments.of(1, new BigDecimal(990), new BigDecimal(990), 0, DiscountType.AMOUNT, 2,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                // Discount - Percent, 10. All sizes
                Arguments.of(1, new BigDecimal(990), new BigDecimal(891), 10, DiscountType.PERCENT, 2,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                Arguments.of(1, new BigDecimal(1390), new BigDecimal(1251), 10, DiscountType.PERCENT, 2,
                        DesignDimension.MEDIUM, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                Arguments.of(1, new BigDecimal(1990), new BigDecimal(1791), 10, DiscountType.PERCENT, 2,
                        DesignDimension.LARGE, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                // Discount - percent. Off number resulting in a complex floating point
                Arguments.of(69, new BigDecimal(4737195), new BigDecimal("1469210.45"), 69,
                        DiscountType.PERCENT, 69,
                        DesignDimension.LARGE, 69, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                // Discount - percent. Shipping - own delivery. Off number resulting in a
                // complex floating point
                Arguments.of(69, new BigDecimal(4737195), new BigDecimal("1469310.45"), 69,
                        DiscountType.PERCENT, 69,
                        DesignDimension.LARGE, 69, DesignType.FAMILY_TREE, ShippingMethod.OWN_DELIVERY,
                        null),
                // Discount - Percent, 100
                Arguments.of(1, new BigDecimal(990), new BigDecimal(0), 100, DiscountType.PERCENT, 2,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                // Discount - Percent, 0
                Arguments.of(1, new BigDecimal(990), new BigDecimal(990), 0, DiscountType.PERCENT, 2,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                // hasMoreThan3 use case. Includes all sizes
                Arguments.of(1, new BigDecimal(1485), new BigDecimal(1485), 0, null, 3,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                Arguments.of(1, new BigDecimal(1980), new BigDecimal("1485.00"), 0, null, 4,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                Arguments.of(1, new BigDecimal(2475), new BigDecimal("1856.25"), 0, null, 5,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                Arguments.of(1, new BigDecimal(3475), new BigDecimal("2606.25"), 0, null, 5,
                        DesignDimension.MEDIUM, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                Arguments.of(1, new BigDecimal(4975), new BigDecimal("3731.25"), 0, null, 5,
                        DesignDimension.LARGE, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                // no discount, more than 3. One item, but quantity of 4
                Arguments.of(1, new BigDecimal(1980), new BigDecimal("1485.00"), 0, null, 1,
                        DesignDimension.SMALL, 4, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                // hasMoreThan3 with another discount (amount)
                Arguments.of(1, new BigDecimal(2475), new BigDecimal(2375), 100, DiscountType.AMOUNT,
                        5, DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        null),
                // hasMoreThan3 with another discount (percent)
                Arguments.of(1, new BigDecimal(2475), new BigDecimal("2227.50"), 10,
                        DiscountType.PERCENT, 5, DesignDimension.SMALL, 1, DesignType.FAMILY_TREE,
                        ShippingMethod.PICK_UP_POINT, null),
                // no transaction items
                Arguments.of(1, new BigDecimal(0), new BigDecimal(0), 0,
                        null, 0, DesignDimension.SMALL, 1, DesignType.FAMILY_TREE,
                        ShippingMethod.PICK_UP_POINT, null),
                // fail scenarios
                // Subtotal mismatch
                Arguments.of(1, new BigDecimal(666), new BigDecimal(495), 1,
                        null, 0, DesignDimension.SMALL, 1, DesignType.FAMILY_TREE,
                        ShippingMethod.PICK_UP_POINT,
                        "does not match calculated subtotal"),
                // Total mismatch - no discounts
                Arguments.of(1, new BigDecimal(990), new BigDecimal(666), 0, null, 2,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        "does not match calculated total"),
                // Total mismatch - discount
                Arguments.of(1, new BigDecimal(990), new BigDecimal(666), 100, DiscountType.AMOUNT, 2,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        "does not match calculated total"),
                // Total mismatch - has more than 3
                Arguments.of(1, new BigDecimal(1980), new BigDecimal(666), 100, null, 4,
                        DesignDimension.SMALL, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        "does not match calculated total"),
                // throws error when trying to use dimension ONE_SIZE
                Arguments.of(1, new BigDecimal(990), new BigDecimal(990), 0, null, 2,
                        DesignDimension.ONE_SIZE, 1, DesignType.FAMILY_TREE, ShippingMethod.PICK_UP_POINT,
                        "dimension data is not valid"));
    }

    @ParameterizedTest
    @MethodSource("verifyPriceArguments")
    @DisplayName("verifyPrice() correctly validates pricing information")
    void verifyPrice(int plantedTrees, BigDecimal total, BigDecimal subTotal, int discountAmount,
            DiscountType discountType, int itemCount, DesignDimension designDimension,
            int designQuantity, DesignType designType, ShippingMethod shippingMethod,
            String exceptionMessageSnippet) {
        // prepare the order
        Order order = new Order();
        order.setPlantedTrees(plantedTrees);
        order.setSubtotal(total);
        order.setTotal(subTotal);
        order.setShippingMethod(shippingMethod);

        // prepare the discount
        Discount discount = null;
        if (discountType != null) {
            discount = new Discount();
            discount.setAmount(discountAmount);
            discount.setType(discountType);
        }
        order.setDiscount(discount);

        // prepare the transaction items
        List<TransactionItem> items = new ArrayList<>();
        for (int i = 0; i < itemCount; i++) {
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
        if (exceptionMessageSnippet == null) {
            assertTrue(orderService.verifyPrice(order));
        } else {
            Throwable exception = assertThrows(ResponseStatusException.class, () -> {
                orderService.verifyPrice(order);
            });
            assertThat(exception.getMessage()).contains(exceptionMessageSnippet);
        }
    }

    private static Stream<Arguments> calculateTotalArguments() {
        return Stream.of(
                Arguments.of(new BigDecimal(495), 100, DiscountType.AMOUNT, false,
                        new BigDecimal("395.00"), null),
                Arguments.of(new BigDecimal(495), 100, DiscountType.PERCENT, false,
                        new BigDecimal("0.00"), null),
                Arguments.of(new BigDecimal(495), 50, DiscountType.PERCENT, false,
                        new BigDecimal("247.50"), null),
                Arguments.of(new BigDecimal(495), 0, null, false, new BigDecimal("495.00"), null),
                Arguments.of(new BigDecimal(495), 0, null, true, new BigDecimal("371.25"), null));
    }

    @ParameterizedTest
    @MethodSource("calculateTotalArguments")
    @DisplayName("calculateTotal() correctly applies discounts to the subtotal")
    void calculateTotal(BigDecimal subTotal, int discountAmount, DiscountType discountType,
            boolean hasMoreThan3, BigDecimal expectedTotal,
            String exceptionMessageSnippet) {
        if (expectedTotal != null) {
            Discount discount = null;
            if (discountType != null) {
                discount = new Discount();
                discount.setType(discountType);
                discount.setAmount(discountAmount);
            }
            assertEquals(orderService.calculateTotal(subTotal, discount, hasMoreThan3),
                    expectedTotal);
        } else {
            Throwable exception = assertThrows(ResponseStatusException.class, () -> {
                Discount discount = null;
                if (discountType != null) {
                    discount = new Discount();
                    discount.setType(discountType);
                    discount.setAmount(discountAmount);
                }
                orderService.calculateTotal(subTotal, discount, hasMoreThan3);
            });
            assertThat(exception.getMessage()).contains(exceptionMessageSnippet);
        }
    }

    private static Stream<Arguments> pricePerItemArguments() {
        return Stream.of(
                Arguments.of(DesignType.FAMILY_TREE, DesignDimension.SMALL, new BigDecimal(495), null),
                Arguments.of(DesignType.FAMILY_TREE, DesignDimension.MEDIUM, new BigDecimal(695), null),
                Arguments.of(DesignType.FAMILY_TREE, DesignDimension.LARGE, new BigDecimal(995), null),
                Arguments.of(DesignType.FAMILY_TREE, DesignDimension.ONE_SIZE, null,
                        "dimension data is not valid"));
    }

    @ParameterizedTest
    @MethodSource("pricePerItemArguments")
    @DisplayName("pricePerItem() correctly returns price based on design type and dimensions")
    void pricePerItem(DesignType designType, DesignDimension designDimension,
            BigDecimal expectedPrice, String exceptionMessageSnippet) {
        // there is no point testing the default options sine they are impossible to
        // each as of now (there are not enum values not covered by the switches)
        if (expectedPrice != null) {
            assertEquals(orderService.pricePerItem(designType, designDimension), expectedPrice);
        } else {
            Throwable exception = assertThrows(ResponseStatusException.class, () -> {
                orderService.pricePerItem(designType, designDimension);
            });
            assertThat(exception.getMessage()).contains(exceptionMessageSnippet);
        }
    }

    @Test
    @DisplayName("updateOrderStatus() correctly updates the status of the order")
    void updateOrderStatus() {
        // prepare the order
        UUID orderId = UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234");
        OrderStatus status = OrderStatus.ASSEMBLING;
        OrderStatus newStatus = OrderStatus.ASSEMBLING;

        Order order = new Order();
        Order newOrder = new Order();

        order.setOrderId(orderId);
        order.setStatus(status);

        newOrder.setOrderId(orderId);
        newOrder.setStatus(status);


        Mockito.when(orderRepository.findByOrderId(orderId)).thenReturn(Optional.of(order));
        Mockito.when(orderRepository.save(order)).thenReturn(newOrder);

        assertEquals(newOrder, orderService.updateOrderStatus(orderId, newStatus));
    }

    @Test
    @DisplayName("updateOrderStatus() throws ResourceNotFoundException if no order is found")
    void updateOrderStatusNotFound() {
        UUID orderId = UUID.fromString("c0a80121-7adb-10c0-817a-dbc2f0ec1234");
        OrderStatus status = OrderStatus.ASSEMBLING;

        Mockito.when(orderRepository.findByOrderId(orderId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orderService.updateOrderStatus(orderId, status));
    }
}
