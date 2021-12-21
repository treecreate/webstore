package dk.treecreate.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApiApplication
{

    public static void main(String[] args)
    {
        SpringApplication.run(ApiApplication.class, args);
    }

    public static <T> void print(T value)
    {
        System.out.println(value);
    }
}
