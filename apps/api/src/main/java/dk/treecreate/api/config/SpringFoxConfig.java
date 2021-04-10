package dk.treecreate.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;

@Configuration
@Import(BeanValidatorPluginsConfiguration.class)
@EnableSwagger2
public class SpringFoxConfig
{
    @Bean
    public Docket api()
    {
        return new Docket(DocumentationType.SWAGGER_2)
            .select()
            .apis(RequestHandlerSelectors.basePackage("dk.treecreate.api"))
            .paths(PathSelectors.any())
            .build()
            .apiInfo(apiInfo()) // information about the API shown at the top of the page
            .useDefaultResponseMessages(false); // removes redundant codes like 404: Not found from every mapping
    }

    private ApiInfo apiInfo()
    {
        return new ApiInfo(
            "Treecreate REST API",
            "A Springboot rest API",
            "0.0.0-development",
            "https://github.com/treecreate/webstore/blob/development/LICENSE",
            new Contact("Treecreate", "treecreate.dk", "info@treecreate.dk"),
            "License of API", "https://github.com/treecreate/webstore/blob/development/LICENSE", Collections.emptyList());
    }
}

