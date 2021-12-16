package dk.treecreate.api;

import dk.treecreate.api.shipmondo.utility.Address;
import dk.treecreate.api.shipmondo.utility.DateAndTime;
import dk.treecreate.api.shipmondo.utility.Sender;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApiApplication
{

    public static void main(String[] args)
    {
        // var addressTest = new Address("test address 1", "test address 2",
        // "zipcode
        // test", "city test", "country_code 1234");
        // var a = new Sender("nae", addressTest);
        // print(addressTest);
        // print(a.getAddress1());
        // print(a.getAddress2());
        // print(a.getZipcode());
        // print(a.getCity());
        // print(a.getCountry_code());
        var b = new DateAndTime();
        b.setDate("2021-01-15");
        b.setFrom_time("24:00");
        print(b.getDate());
        print(b.getFrom_time());
        // SpringApplication.run(ApiApplication.class, args);
    }

    public static <T> void print(T value)
    {
        System.out.println(value);
    }
}
