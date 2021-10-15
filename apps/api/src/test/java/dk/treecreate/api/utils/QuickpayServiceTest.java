package dk.treecreate.api.utils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Locale;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class QuickpayServiceTest
{
    @Autowired
    QuickpayService quickpayService;
    @Autowired
    LinkService linkService;

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
        assertTrue(quickpayService.createOrderId(email, environment).contains(expectedPrefix));
    }

    private static Stream<Arguments> generatePaymentRedirectUrlArguments()
    {
        return Stream.of(
            Arguments.of(Environment.DEVELOPMENT, Locale.ENGLISH, true,
                "http://localhost:4200/payment/success"),
            Arguments.of(Environment.DEVELOPMENT, new Locale("dk"), true,
                "http://localhost:4200/payment/success"),
            Arguments.of(Environment.DEVELOPMENT, Locale.ENGLISH, false,
                "http://localhost:4200/payment/cancelled"),
            Arguments.of(Environment.DEVELOPMENT, new Locale("dk"), false,
                "http://localhost:4200/payment/cancelled"),
            Arguments.of(Environment.STAGING, Locale.ENGLISH, true,
                "https://testing.treecreate.dk/en-US/payment/success"),
            Arguments.of(Environment.STAGING, new Locale("dk"), true,
                "https://testing.treecreate.dk/dk/payment/success"),
            Arguments.of(Environment.STAGING, Locale.ENGLISH, false,
                "https://testing.treecreate.dk/en-US/payment/cancelled"),
            Arguments.of(Environment.STAGING, new Locale("dk"), false,
                "https://testing.treecreate.dk/dk/payment/cancelled"),
            Arguments.of(Environment.PRODUCTION, Locale.ENGLISH, true,
                "https://treecreate.dk/en-US/payment/success"),
            Arguments.of(Environment.PRODUCTION, new Locale("dk"), true,
                "https://treecreate.dk/dk/payment/success"),
            Arguments.of(Environment.PRODUCTION, Locale.ENGLISH, false,
                "https://treecreate.dk/en-US/payment/cancelled"),
            Arguments.of(Environment.PRODUCTION, new Locale("dk"), false,
                "https://treecreate.dk/dk/payment/cancelled"));
    }

    @ParameterizedTest
    @MethodSource("generatePaymentRedirectUrlArguments")
    @DisplayName("generatePaymentRedirectUrl() returns a correctly structured redirect url")
    void generatePaymentRedirectUrl(Environment environment, Locale locale,
                                    boolean successLink, String expectedUrl)
    {
        assertEquals(linkService.generatePaymentRedirectUrl(environment, locale, successLink),
            expectedUrl);
    }

}
