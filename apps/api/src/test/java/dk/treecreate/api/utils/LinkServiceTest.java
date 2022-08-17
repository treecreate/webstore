package dk.treecreate.api.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;

import dk.treecreate.api.config.CustomPropertiesConfig;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Stream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
public class LinkServiceTest {
  @Autowired LinkService linkService;
  @MockBean CustomPropertiesConfig customProperties;

  private static Stream<Arguments> generatePaymentRedirectUrlArguments() {
    return Stream.of(
        Arguments.of(
            Environment.DEVELOPMENT, Locale.ENGLISH, true, "http://localhost:4200/payment/success"),
        Arguments.of(
            Environment.DEVELOPMENT,
            new Locale("dk"),
            true,
            "http://localhost:4200/payment/success"),
        Arguments.of(
            Environment.DEVELOPMENT,
            Locale.ENGLISH,
            false,
            "http://localhost:4200/payment/cancelled"),
        Arguments.of(
            Environment.DEVELOPMENT,
            new Locale("dk"),
            false,
            "http://localhost:4200/payment/cancelled"),
        Arguments.of(
            Environment.STAGING,
            Locale.ENGLISH,
            true,
            "https://testing.treecreate.dk/en-US/payment/success"),
        Arguments.of(
            Environment.STAGING,
            new Locale("dk"),
            true,
            "https://testing.treecreate.dk/dk/payment/success"),
        Arguments.of(
            Environment.STAGING,
            Locale.ENGLISH,
            false,
            "https://testing.treecreate.dk/en-US/payment/cancelled"),
        Arguments.of(
            Environment.STAGING,
            new Locale("dk"),
            false,
            "https://testing.treecreate.dk/dk/payment/cancelled"),
        Arguments.of(
            Environment.PRODUCTION,
            Locale.ENGLISH,
            true,
            "https://treecreate.dk/en-US/payment/success"),
        Arguments.of(
            Environment.PRODUCTION,
            new Locale("dk"),
            true,
            "https://treecreate.dk/dk/payment/success"),
        Arguments.of(
            Environment.PRODUCTION,
            Locale.ENGLISH,
            false,
            "https://treecreate.dk/en-US/payment/cancelled"),
        Arguments.of(
            Environment.PRODUCTION,
            new Locale("dk"),
            false,
            "https://treecreate.dk/dk/payment/cancelled"));
  }

  private static Stream<Arguments> generateCallbackUrlArguments() {
    return Stream.of(
        Arguments.of(Environment.DEVELOPMENT, "http://localhost:5050/paymentCallback"),
        Arguments.of(Environment.STAGING, "https://api.testing.treecreate.dk/paymentCallback"),
        Arguments.of(Environment.PRODUCTION, "https://api.treecreate.dk/paymentCallback"));
  }

  private static Stream<Arguments> generateResetPasswordLinkArguments() {
    return Stream.of(
        Arguments.of(
            new UUID(0, 0),
            Locale.ENGLISH,
            Environment.DEVELOPMENT,
            "http://localhost:4200/resetPassword/00000000-0000-0000-0000-000000000000"),
        Arguments.of(
            new UUID(0, 0),
            Locale.ENGLISH,
            Environment.STAGING,
            "https://testing.treecreate.dk/en-US/resetPassword/00000000-0000-0000-0000-000000000000"),
        Arguments.of(
            new UUID(0, 0),
            Locale.ENGLISH,
            Environment.PRODUCTION,
            "https://treecreate.dk/en-US/resetPassword/00000000-0000-0000-0000-000000000000"),
        Arguments.of(
            new UUID(0, 0),
            new Locale("dk"),
            Environment.DEVELOPMENT,
            "http://localhost:4200/resetPassword/00000000-0000-0000-0000-000000000000"),
        Arguments.of(
            new UUID(0, 0),
            new Locale("dk"),
            Environment.STAGING,
            "https://testing.treecreate.dk/dk/resetPassword/00000000-0000-0000-0000-000000000000"),
        Arguments.of(
            new UUID(0, 0),
            new Locale("dk"),
            Environment.PRODUCTION,
            "https://treecreate.dk/dk/resetPassword/00000000-0000-0000-0000-000000000000"));
  }

  private static Stream<Arguments> generateNewsletterUnsubscribeLinkArguments() {
    return Stream.of(
        Arguments.of(
            new UUID(0, 0),
            Locale.ENGLISH,
            Environment.DEVELOPMENT,
            "http://localhost:4200/newsletter/unsubscribe/00000000-0000-0000-0000-000000000000"),
        Arguments.of(
            new UUID(0, 0),
            Locale.ENGLISH,
            Environment.STAGING,
            "https://testing.treecreate.dk/en-US/newsletter/unsubscribe/00000000-0000-0000-0000-000000000000"),
        Arguments.of(
            new UUID(0, 0),
            Locale.ENGLISH,
            Environment.PRODUCTION,
            "https://treecreate.dk/en-US/newsletter/unsubscribe/00000000-0000-0000-0000-000000000000"),
        Arguments.of(
            new UUID(0, 0),
            new Locale("dk"),
            Environment.DEVELOPMENT,
            "http://localhost:4200/newsletter/unsubscribe/00000000-0000-0000-0000-000000000000"),
        Arguments.of(
            new UUID(0, 0),
            new Locale("dk"),
            Environment.STAGING,
            "https://testing.treecreate.dk/dk/newsletter/unsubscribe/00000000-0000-0000-0000-000000000000"),
        Arguments.of(
            new UUID(0, 0),
            new Locale("dk"),
            Environment.PRODUCTION,
            "https://treecreate.dk/dk/newsletter/unsubscribe/00000000-0000-0000-0000-000000000000"));
  }

  @ParameterizedTest
  @MethodSource("generatePaymentRedirectUrlArguments")
  @DisplayName("generatePaymentRedirectUrl() returns a correctly structured redirect url")
  void generatePaymentRedirectUrl(
      Environment environment, Locale locale, boolean successLink, String expectedUrl) {
    Mockito.when(customProperties.getEnvironment()).thenReturn(environment);

    assertEquals(linkService.generatePaymentRedirectUrl(locale, successLink), expectedUrl);
  }

  @ParameterizedTest
  @MethodSource("generateCallbackUrlArguments")
  @DisplayName("generateCallbackUrl() returns a correctly structured callback url")
  void generateCallbackUrl(Environment environment, String expectedUrl) {
    Mockito.when(customProperties.getEnvironment()).thenReturn(environment);

    assertEquals(linkService.generateCallbackUrl(), expectedUrl);
  }

  @ParameterizedTest
  @MethodSource("generateResetPasswordLinkArguments")
  @DisplayName("generateResetPasswordLink() returns a correctly structured reset password link")
  void generateResetPasswordLink(
      UUID token, Locale locale, Environment environment, String expectedUrl) {
    Mockito.when(customProperties.getEnvironment()).thenReturn(environment);

    assertEquals(linkService.generateResetPasswordLink(token, locale), expectedUrl);
  }

  @ParameterizedTest
  @MethodSource("generateNewsletterUnsubscribeLinkArguments")
  @DisplayName(
      "generateNewsletterUnsubscribeLink() returns a correctly structured newsletter unsubscribe link")
  void generateNewsletterUnsubscribeLink(
      UUID newsletterId, Locale locale, Environment environment, String expectedUrl) {
    Mockito.when(customProperties.getEnvironment()).thenReturn(environment);

    assertEquals(linkService.generateNewsletterUnsubscribeLink(newsletterId, locale), expectedUrl);
  }
}
