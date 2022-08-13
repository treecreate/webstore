package dk.treecreate.api.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Locale;
import java.util.stream.Stream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class LocaleServiceTest {
  @Autowired private LocaleService localeService;

  private static Stream<Arguments> getLocaleArguments() {
    return Stream.of(
        Arguments.of("dk", new Locale("dk")),
        Arguments.of("en", Locale.ENGLISH),
        Arguments.of(null, new Locale("dk")));
  }

  @ParameterizedTest
  @MethodSource("getLocaleArguments")
  @DisplayName("getLocale() returns correct value")
  void getLocale(String lang, Locale expected) {
    assertEquals(expected, localeService.getLocale(lang));
  }
}
