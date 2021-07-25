package dk.treecreate.api.user;

import dk.treecreate.api.user.dto.UpdateUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService
{
    @Autowired
    UserRepository userRepository;

    public User updateUser(UpdateUserRequest updateUserRequest, User user)
    {

        if (updateUserRequest.getEmail() != null)
        {
            if (userRepository.existsByEmail(updateUserRequest.getEmail()))
            {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already taken");
            }
            user.setEmail(updateUserRequest.getEmail());
            user.setUsername(updateUserRequest.getEmail());
        }
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
}
