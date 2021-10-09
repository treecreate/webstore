package dk.treecreate.api.mail;

import dk.treecreate.api.utils.LocaleService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Locale;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class MailServiceTest
{
    @Autowired
    MailService mailService;

    // sendSignupEmail and sendResetPasswordEmail are not tested due to their simplicity
    // Potential test would be validating that sendMail() method gets called correctly but it is private
    private static Stream<Arguments> isValidEmailArguments()
    {
        return Stream.of(Arguments.of("test@domain.yahoo", true),
            Arguments.of("test.test@domain.yahoo", true),
            Arguments.of("test.test.test@domain.yahoo", true),
            Arguments.of("@domain.yahoo", false),
            Arguments.of("test.test.domain.yahoo", false),
            Arguments.of("test.@domain.yahoo", false),
            Arguments.of("test.,@domain.yahoo", false),
            Arguments.of("test.!@domain.yahoo", true),
            Arguments.of("test.test@test@domain.yahoo", false),
            Arguments.of("test!test@domain.yahoo", true),
            Arguments.of("test#test@domain.yahoo", true),
            Arguments.of("test_test@domain.yahoo", true),
            Arguments.of("test@domain.yahoo", true),
            Arguments.of("test@domain", true),
            Arguments.of("test@domain.", false),
            Arguments.of("test@.yahoo", false),
            Arguments.of("test@domain.domain.yahoo", true),
            Arguments.of("test@domain#test.yahoo", false),
            Arguments.of("test@domain#test.yahoo", false),
            Arguments.of("test@domain.yahoo", true),
            Arguments.of("test@domain.yahoo", true),
            Arguments.of("test@domain.yahoo", true),
            Arguments.of("", false), Arguments.of("testÅ", false),
            Arguments.of("testÆ@domain.dk", true),
            Arguments.of("testÆ.æøæø@Ådomain.dk", true),
            Arguments.of("testÆ@domain.Å", true),
            Arguments.of("thisIsExactly253Characters" +
                "AccordingToAllKnownLawsOfAviationThereIsNoWayABeeShouldBeAbleToFly" +
                "ItsWingsAreTooSmallToGetItsFatLittleBodyOffTheGroundTheBeeOfCourse" +
                "FliesAnywayBecauseBeesDontCareWhatHumansThinkIsImpossible" +
                "Åæøæøæøæøæøæøæøæøæøæøæøæø" + "@domain.yahoo", true),
            Arguments.of("thisIsExactly254Characters" +
                "AccordingToAllKnownLawsOfAviationThereIsNoWayABeeShouldBeAbleToFly" +
                "ItsWingsAreTooSmallToGetItsFatLittleBodyOffTheGroundTheBeeOfCourse" +
                "FliesAnywayBecauseBeesDontCareWhatHumansThinkIsImpossible" +
                "Åæøæøæøæøæøæøæøæøæøæøæøæøæ" + "@domain.yahoo", true),
            Arguments.of("thisIsExactly255Characters" +
                "AccordingToAllKnownLawsOfAviationThereIsNoWayABeeShouldBeAbleToFly" +
                "ItsWingsAreTooSmallToGetItsFatLittleBodyOffTheGroundTheBeeOfCourse" +
                "FliesAnywayBecauseBeesDontCareWhatHumansThinkIsImpossible" +
                "Åæøæøæøæøæøæøæøæøæøæøæøæøæø" + "@domain.yahoo", true),
            Arguments.of("thisIsExactly256Characters" +
                "AccordingToAllKnownLawsOfAviationThereIsNoWayABeeShouldBeAbleToFly" +
                "ItsWingsAreTooSmallToGetItsFatLittleBodyOffTheGroundTheBeeOfCourse" +
                "FliesAnywayBecauseBeesDontCareWhatHumansThinkIsImpossible" +
                "Åæøæøæøæøæøæøæøæøæøæøæøæøæøæ" + "@domain.yahoo", false));
    }

    private static Stream<Arguments> getLocaleArguments()
    {
        return Stream.of(
            Arguments.of("dk", new Locale("dk")),
            Arguments.of("en", Locale.ENGLISH),
            Arguments.of(null, new Locale("dk")));
    }

    @ParameterizedTest
    @MethodSource("isValidEmailArguments")
    @DisplayName("isValidEmail() returns correct value")
    void isValidEmail(String email,
                      boolean expected)
    {
        assertEquals(expected, mailService.isValidEmail(email));
    }

    @ParameterizedTest
    @MethodSource("getLocaleArguments")
    @DisplayName("getLocale() returns correct value")
    void getLocale(String lang, Locale expected)
    {
        assertEquals(expected, LocaleService.getLocale(lang));
    }
}
