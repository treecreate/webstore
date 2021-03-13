package dk.treecreate.api.healthcheckControllerTests;

import dk.treecreate.api.ApiApplication;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.filter.log.RequestLoggingFilter;
import io.restassured.filter.log.ResponseLoggingFilter;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static io.restassured.RestAssured.*;



@SpringBootTest
class HealthcheckControllerTests
{
    private static RequestSpecification spec;


    // Declared port here, can be changed to be the .properties version eventually
    private static final int port = 8080;

    @Autowired
    ApiApplication apiApplication;

    @BeforeAll    // Set up for all tests in this class
    public static void initSpec(){
        spec = new RequestSpecBuilder()
            .setContentType(ContentType.JSON)
            .setBaseUri("http://localhost:" + port)
            .addFilter(new ResponseLoggingFilter())//log request and response for better debugging. You can also only log if a requests fails.
            .addFilter(new RequestLoggingFilter())
            .build();
    }


    @Test // Requires the application to be running to pass
    @DisplayName("'/healthcheck' returns 200")
    void checkResponseStatus()
    {
        given(spec).
            when().
            get("/healthcheck").
            then().
            assertThat().
            statusCode(200);
    }

}
