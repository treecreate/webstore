package dk.treecreate.api.shipmondo.utility;

import java.util.ArrayList;
import java.util.Arrays;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class Address
{

    protected String address1; // Required
    protected String address2;
    protected String zipcode; // Required
    protected String city; // Required
    protected String country_code; // Required

    /**
     * Empty Class constructor
     */
    public Address()
    {
        /* Empty constructor */ }

    /**
     * Class constructor with only address 1
     * 
     * @param address1 Address of the receiver, including address number.
     * @param zipcode Name of the city that the zipcode refers to.
     * @param city Name of the city that the zipcode refers to.
     * @param country_code ISO 3166-1 alpha-2 country code of the receiver address.
     * @throws Exception
     */
    public Address(String address1, String zipcode, String city, String country_code)
    {
        this.address1 = address1;
        this.zipcode = zipcode;
        this.city = city;
        this.setCountry_code(country_code);
    }

    /**
     * Class constructor with both address fields
     * 
     * @param address1 Address of the receiver, including address number.
     * @param address2 Second address line of the receiver. Can be used for i.e. apartment number.
     * @param zipcode Name of the city that the zipcode refers to.
     * @param city Name of the city that the zipcode refers to.
     * @param country_code ISO 3166-1 alpha-2 country code of the receiver address.
     * @throws Exception
     */
    public Address(String address1, String address2, String zipcode, String city, String country_code)
    {
        this.address1 = address1;
        this.address2 = address2;
        this.zipcode = zipcode;
        this.city = city;
        this.setCountry_code(country_code);
    }

    public static Address treecreateDefault()
    {
        return new Address("Hillerødgade 69, 3 etage", "2200", "København", "DK");
    }

    // Getters and setters
    public String getAddress1()
    {
        return this.address1;
    }

    public void setAddress1(String address1)
    {
        this.address1 = address1;
    }

    public String getAddress2()
    {
        return this.address2;
    }

    public void setAddress2(String address2)
    {
        this.address2 = address2;
    }

    public String getZipcode()
    {
        return this.zipcode;
    }

    public void setZipcode(String zipcode)
    {
        this.zipcode = zipcode;
    }

    public String getCity()
    {
        return this.city;
    }

    public void setCity(String city)
    {
        this.city = city;
    }

    public String getCountry_code()
    {
        return this.country_code;
    }

    /**
     * Enum containing all the valid country codes in the ISO 3166-1 alpha-2 format
     */
    private enum CountryCodes
    {
        DK, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BA,
        BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CK, CR, CI, HR, CU, CW,
        CY, CZ, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL,
        GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE,
        KI, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, MC, MN, ME,
        MS, MA, MZ, MM, NA, NR, NP, NL, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PA, PG, PY, PE, PH, PN, PL, PT,
        PR, QA, RE, RO, RU, RW, BL, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SX, SK, SI, SB, SO, ZA, GS,
        SS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TJ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, GB, US, UM,
        UY, UZ, VU, VN, WF, EH, YE, ZM, ZW
    }

    /**
     * Compares the passed country code with the CountryCodes enum to ensure it is valid and then sets it
     * @param country_code  The desired country code in ISO 3166-1 alpha-2 format
     * @throws ResponseStatusException If the given country code is not in the CountryCodes Enum
     */
    public void setCountry_code(String country_code)
    {
        try {
            if (country_code != null) {
                CountryCodes.valueOf(country_code.toUpperCase());
                this.country_code = country_code.toUpperCase();
            } else {
                this.country_code = null;
            }
 
        } catch (IllegalArgumentException | NullPointerException e) {
            System.err.println("Invalid country code provided. Invalid value: " + country_code); // TODO - use LOGGER
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid country code{'" + country_code + "'} ");
        }
    }

    @Override
    public String toString()
    {
        return "{" + " address1='" + getAddress1() + "'" + ", address2='" + getAddress2() + "'" + ", zipcode='"
                + getZipcode() + "'" + ", city='" + getCity() + "'" + ", country_code='" + getCountry_code() + "'"
                + "}";
    }

}
