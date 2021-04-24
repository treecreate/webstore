package dk.treecreate.api.user;

import dk.treecreate.api.exceptionhandling.UserAlreadyExistAuthenticationException;
import dk.treecreate.api.user.dto.SignupRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService
{
    @Autowired
    UserRepo userRepo;

    @Transactional(value = "transactionManager")
    public User createUser(SignupRequestDto signupRequestDto)
    {
        if (signupRequestDto.getId() != null && userRepo.existsById(signupRequestDto.getId()))
        {
            throw new UserAlreadyExistAuthenticationException(
                "User with User id " + signupRequestDto.getId() + " already exist");
        } else if (userRepo.existsByEmail(signupRequestDto.getEmail()))
        {
            throw new UserAlreadyExistAuthenticationException(
                "User with email id " + signupRequestDto.getEmail() + " already exist");
        }
        User user = new User();
        user.setId(signupRequestDto.getId());
        user.setEmail(signupRequestDto.getEmail());
        user.setFirstName(signupRequestDto.getFirstName());
        user.setLastName(signupRequestDto.getLastName());
        user = userRepo.save(user);
        userRepo.flush();
        return user;
    }
}
