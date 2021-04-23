package dk.treecreate.api.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
public class SecurityConfig  extends WebSecurityConfigurerAdapter
{

    @Override
    protected void configure(HttpSecurity http) throws Exception
    {
        http
            .authorizeRequests().anyRequest().authenticated()
            .and()
            .oauth2ResourceServer().jwt();

        Okta.configureResourceServer401ResponseBody(http);
    }
}

