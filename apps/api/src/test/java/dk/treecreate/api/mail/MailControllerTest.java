package dk.treecreate.api.mail;

import dk.treecreate.api.TestUtilsService;
import dk.treecreate.api.authentication.jwt.AuthEntryPointJwt;
import dk.treecreate.api.authentication.jwt.JwtUtils;
import dk.treecreate.api.authentication.services.UserDetailsServiceImpl;
import dk.treecreate.api.mail.dto.SignupDto;
import dk.treecreate.api.utils.LinkService;
import dk.treecreate.api.utils.LocaleService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.io.UnsupportedEncodingException;
import java.util.Locale;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(value = MailController.class,
    excludeAutoConfiguration = SecurityAutoConfiguration.class)
@WithMockUser(username = "test@treecreate.dk", password = "testPassword",
    roles = {"USER", "DEVELOPER", "ADMIN"})
class MailControllerTest
{
    @Autowired
    private MockMvc mvc;
    @MockBean
    private MailService mailService;
    @MockBean
    private UserDetailsServiceImpl userDetailsService;
    @MockBean
    private AuthEntryPointJwt authEntryPointJwt;
    @MockBean
    private JwtUtils jwtUtils;
    @MockBean
    private LocaleService localeService;
    @MockBean
    private LinkService linkService;


    //region /signup endpoint tests

    @Test
    @DisplayName("Signup endpoint returns correct status codes - Accepted")
    void signupStatusCodesAccepted() throws Exception
    {
        String email = "test@treecreate.dk";
        SignupDto params = new SignupDto();
        params.setEmail(email);

        Mockito.when(mailService.isValidEmail(email)).thenReturn(true);

        mvc.perform(post("/mail/signup").content(TestUtilsService.asJsonString(params))
            .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isAccepted());
    }

    @Test
    @DisplayName("Signup endpoint returns correct status codes - Accepted")
    void signupStatusCodesBadRequest() throws Exception
    {
        String email = "invalid email";
        SignupDto params = new SignupDto();
        params.setEmail(email);

        Mockito.when(mailService.isValidEmail(email)).thenReturn(false);

        mvc.perform(post("/mail/signup").content(TestUtilsService.asJsonString(params))
            .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Signup endpoint returns correct status codes - Exceptions")
    void signupStatusCodesException() throws Exception
    {
        String email = "bz.jasiek@gmail";
        SignupDto params = new SignupDto();
        params.setEmail(email);

        Mockito.when(mailService.isValidEmail(email)).thenReturn(true);
        Mockito.when(localeService.getLocale(null)).thenReturn(new Locale("dk"));
        Mockito.doThrow(UnsupportedEncodingException.class).when(mailService)
            .sendSignupEmail(anyString(), any(Locale.class));

        mvc.perform(post("/mail/signup").content(TestUtilsService.asJsonString(params))
            .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("Signup endpoint returns correct Message - Accepted")
    void signupMessageAccepted() throws Exception
    {
        String email = "test@treecreate.dk";
        SignupDto params = new SignupDto();
        params.setEmail(email);

        Mockito.when(mailService.isValidEmail(email)).thenReturn(true);

        mvc.perform(post("/mail/signup").content(TestUtilsService.asJsonString(params))
            .contentType(MediaType.APPLICATION_JSON)).andExpect(content().string(""));
    }

    @Test
    @DisplayName("Signup endpoint returns correct Message - Bad Request")
    void signupMessageBadRequest() throws Exception
    {
        String email = "invalid email";
        SignupDto params = new SignupDto();
        params.setEmail(email);

        Mockito.when(mailService.isValidEmail(email)).thenReturn(false);

        mvc.perform(post("/mail/signup").content(TestUtilsService.asJsonString(params))
                .contentType(MediaType.APPLICATION_JSON))
            // the message comes from a ResponseStatusException so has to be handled differently from normal content
            .andExpect(result -> assertEquals("Provided email is not a valid email",
                result.getResponse().getErrorMessage()));
    }

    @Test
    @DisplayName("Signup endpoint returns correct Message - Exceptions")
    void signupMessageException() throws Exception
    {
        String email = "bz.jasiek@gmail";
        SignupDto params = new SignupDto();
        params.setEmail(email);

        Mockito.when(mailService.isValidEmail(email)).thenReturn(true);
        Mockito.when(localeService.getLocale(null)).thenReturn(new Locale("dk"));
        doThrow(UnsupportedEncodingException.class).when(mailService)
            .sendSignupEmail(anyString(), any(Locale.class));

        mvc.perform(post("/mail/signup").content(TestUtilsService.asJsonString(params))
                .contentType(MediaType.APPLICATION_JSON))
            // the message comes from a ResponseStatusException so has to be handled differently from normal content
            .andExpect(result -> assertEquals("Failed to send an email",
                result.getResponse().getErrorMessage()));
    }

    //endregion
}
