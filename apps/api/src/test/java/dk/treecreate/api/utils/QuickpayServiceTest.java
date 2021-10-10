package dk.treecreate.api.utils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class QuickpayServiceTest
{
    @Autowired
    QuickpayService quickpayService;
    

    private static Stream<Arguments> createOrderIdArguments()
    {
        return Stream.of(
            Arguments.of("test@hotdeals.dev", Environment.DEVELOPMENT, "Dtest-"),
            Arguments.of("test@hotdeals.dev", Environment.PRODUCTION, "Ptest-"),
            Arguments.of("tes@hotdeals.dev", Environment.DEVELOPMENT, "Dtesx-"),
            Arguments.of("t@hotdeals.dev", Environment.DEVELOPMENT, "Dtxxx-"),
            Arguments.of("testIsLong@hotdeals.dev", Environment.DEVELOPMENT, "Dtest-"));
    }

    @ParameterizedTest
    @MethodSource("createOrderIdArguments")
    @DisplayName("createOrderId() returns a correctly structured quickpay order id")
    void createOrderId(String email, Environment environment, String expectedPrefix)
    {
        System.out.println(quickpayService.createOrderId(email, environment));
        assertTrue(quickpayService.createOrderId(email, environment).contains(expectedPrefix));
    }
}
