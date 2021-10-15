package dk.treecreate.api.user;

import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.mail.MailService;
import dk.treecreate.api.user.dto.UpdateUserRequest;
import dk.treecreate.api.utils.LocaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;

@Service
public class UserService
{
    @Autowired
    UserRepository userRepository;
    @Autowired
    AuthUserService authUserService;
    @Autowired
    MailService mailService;
    @Autowired
    private LocaleService localeService;

    public User updateUser(UpdateUserRequest updateUserRequest, User user)
        throws MessagingException, UnsupportedEncodingException
    {
        if (updateUserRequest.getEmail() != null &&
            !updateUserRequest.getEmail().equals(user.getEmail()))
        {
            if (!updateUserRequest.getEmail().equals(user.getEmail()) &&
                userRepository.existsByEmail(updateUserRequest.getEmail()))
            {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already taken");
            }
            user.setEmail(updateUserRequest.getEmail());
            user.setUsername(updateUserRequest.getEmail());
            triggerNewAccountVerification(user);
        }
        if (updateUserRequest.getPassword() != null)
            user.setPassword(authUserService.encodePassword(updateUserRequest.getPassword()));
        if (updateUserRequest.getName() != null)
            user.setName(updateUserRequest.getName());
        if (updateUserRequest.getPhoneNumber() != null)
            user.setPhoneNumber(updateUserRequest.getPhoneNumber());
        if (updateUserRequest.getStreetAddress() != null)
            user.setStreetAddress(updateUserRequest.getStreetAddress());
        if (updateUserRequest.getStreetAddress2() != null)
            user.setStreetAddress2(updateUserRequest.getStreetAddress2());
        if (updateUserRequest.getCity() != null)
            user.setCity(updateUserRequest.getCity());
        if (updateUserRequest.getCountry() != null)
            user.setCountry(updateUserRequest.getCountry());
        if (updateUserRequest.getPostcode() != null)
            user.setPostcode(updateUserRequest.getPostcode());
        return user;
    }

    private User triggerNewAccountVerification(User user)
        throws MessagingException, UnsupportedEncodingException
    {
        System.out.println("Setting to false");
        user.setIsVerified(false);
        mailService.sendVerificationEmail(user.getEmail(), user.getToken().toString(),
            localeService.getLocale(null));
        return user;
    }
}
