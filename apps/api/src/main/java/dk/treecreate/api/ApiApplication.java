package dk.treecreate.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.Sender;

@SpringBootApplication
public class ApiApplication
{

    public static void main(String[] args)
    {
        var addressTest = new Address("test address 1", "test address 2", "zipcode test", "city test", "country_code 1234");
        var a = new Sender("nae", addressTest);
        print(addressTest);
        print(a.getAddress1());
        print(a.getAddress2());
        print(a.getZipcode());
        print(a.getCity());
        print(a.getCountry_code());
        //SpringApplication.run(ApiApplication.class, args);
    }

    public static <T> void print(T value ) {
        System.out.println(value);
    }
}
