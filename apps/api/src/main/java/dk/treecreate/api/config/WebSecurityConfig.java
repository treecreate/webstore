package dk.treecreate.api.config;

import dk.treecreate.api.authentication.jwt.AuthEntryPointJwt;
import dk.treecreate.api.authentication.jwt.AuthTokenFilter;
import dk.treecreate.api.authentication.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
    // securedEnabled = true,
    // jsr250Enabled = true,
    prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
  @Autowired UserDetailsServiceImpl userDetailsService;

  @Autowired private AuthEntryPointJwt unauthorizedHandler;

  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
  }

  @Override
  public void configure(AuthenticationManagerBuilder authenticationManagerBuilder)
      throws Exception {
    authenticationManagerBuilder
        .userDetailsService(userDetailsService)
        .passwordEncoder(passwordEncoder());
  }

  @Bean
  @Override
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.cors()
        .and()
        .csrf()
        .disable()
        .exceptionHandling()
        .authenticationEntryPoint(unauthorizedHandler)
        .and()
        .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
        .authorizeRequests()
        .antMatchers("/auth/refresh")
        .authenticated()
        .antMatchers("/auth/logout")
        .authenticated()
        .antMatchers("/auth/**")
        .permitAll()
        .antMatchers("/users/resetPassword/{email}")
        .permitAll()
        .antMatchers("/users/updatePassword")
        .permitAll()
        .antMatchers("/paymentCallback")
        .permitAll()
        .antMatchers("/discounts/{discountCode}")
        .permitAll()
        .antMatchers("/newsletter")
        .authenticated()
        .antMatchers("/newsletter/me")
        .authenticated()
        .antMatchers("/newsletter/**")
        .permitAll()
        .antMatchers(HttpMethod.POST, "/events")
        .permitAll()
        .antMatchers(HttpMethod.POST, "/errorlogs")
        .permitAll()
        .antMatchers(HttpMethod.POST, "/orders/custom")
        .permitAll()
        .antMatchers(HttpMethod.GET, "/orders/planted-trees")
        .permitAll()
        .antMatchers(HttpMethod.POST, "/feedback")
        .permitAll()
        .antMatchers("/healthcheck")
        .permitAll()
        .antMatchers(
            "/docs", // Swagger docs endpoints
            "/v2/api-docs",
            "/configuration/ui",
            "/swagger-resources/**",
            "/configuration/security",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/webjars/**")
        .permitAll()
        .antMatchers("/h2/console/**")
        .permitAll() // H2 database calls during testing
        .anyRequest()
        .authenticated();

    http.addFilterBefore(
        authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
  }
}
