package dk.treecreate.api.user;

import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import dk.treecreate.api.user.dto.GetUsersResponse;
import dk.treecreate.api.user.dto.UpdateUserRequest;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("users")
@Api(tags = {"Users"})
public class UserController
{

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;
    @Autowired
    AuthUserService authUserService;

    @GetMapping()
    @Operation(summary = "Get all users")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "A list of users",
            response = GetUsersResponse.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public List<User> getUsers()
    {
        return userRepository.findAll();
    }

    @GetMapping("{userId}")
    @Operation(summary = "Get a user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "User information",
            response = User.class),
        @ApiResponse(code = 404, message = "User not found")})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public User getUser(
        @ApiParam(name = "userId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID userId)
    {
        return userRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @PutMapping("{userId}")
    @Operation(summary = "Update a user as a developer/admin")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "User information",
            response = User.class),
        @ApiResponse(code = 404, message = "User not found")
    })
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public User updateUser(
        @ApiParam(name = "userId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID userId,
        @RequestBody(required = false) @Valid UpdateUserRequest updateUserRequest)
    {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (updateUserRequest == null) return user;
        return userRepository.save(userService.updateUser(updateUserRequest, user));
    }

    @PutMapping()
    @Operation(summary = "Update the currently authenticated user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "User information",
            response = User.class),
        @ApiResponse(code = 404, message = "User not found")
    })
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public User updateCurrentUser(
        @RequestBody(required = false) @Valid UpdateUserRequest updateUserRequest)
    {
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (updateUserRequest == null) return user;
        return userRepository.save(userService.updateUser(updateUserRequest, user));
    }

    @DeleteMapping("{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Get all users")
    @ApiResponses(value = {
        @ApiResponse(code = 204, message = "A list of users",
            response = GetUsersResponse.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public void deleteUser(
        @ApiParam(name = "userId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID userId)
    {

        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
    }
}
