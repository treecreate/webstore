package dk.treecreate.api.designs;

import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.designs.dto.CreateDesignRequest;
import dk.treecreate.api.designs.dto.GetAllDesignsResponse;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("designs")
@Api(tags = {"Designs"})
public class DesignController
{

    @Autowired
    DesignRepository designRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AuthUserService authUserService;

    @GetMapping()
    @Operation(summary = "Get all designs")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "A list of designs",
            response = GetAllDesignsResponse.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public List<Design> getAll()
    {
        return designRepository.findAll();
    }


    @GetMapping("me")
    @Operation(summary = "Get all designs of current user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "A list of designs",
            response = GetAllDesignsResponse.class)})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public List<Design> getAllOfCurrentUser()
    {
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return designRepository.findByUser(currentUser);
    }

    @GetMapping("{userId}")
    @Operation(summary = "Get all designs of specified user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "A list of designs",
            response = GetAllDesignsResponse.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public List<Design> getAllOfSpecificUser(
        @ApiParam(name = "userID", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID userId)
    {

        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return designRepository.findByUser(user);
    }

    @PostMapping("{designId}")
    @Operation(summary = "Get a specific design. Developer and Admin only.")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Design entity",
            response = Design.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public Design getDesign(
        @ApiParam(name = "designId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID designId)
    {
        return designRepository.findByDesignId(designId)
            .orElseThrow(() -> new ResourceNotFoundException("Design not found"));
    }

    @GetMapping("me/{designId}")
    @Operation(summary = "Get a specific design of currently authenticated user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Design entity",
            response = Design.class)})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public Design getDesignOfCurrentUser(
        @ApiParam(name = "designId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID designId)
    {
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Design design = designRepository.findByDesignId(designId)
            .orElseThrow(() -> new ResourceNotFoundException("Design not found"));

        if (design.getUser().getUserId() != currentUser.getUserId())
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "The design belongs to another user");
        }

        return design;
    }

    @PostMapping()
    @Operation(summary = "Create a new design entity")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Design information",
            response = Design.class),})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public Design create(@Valid @RequestBody CreateDesignRequest design)
    {
        // Get currently authenticated user
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // Get the specified user
        User user = userRepository.findByUserId(design.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // validate that the design belongs to the logged in user
        // ignore if the current user is a developer/admin.
        // Since every dev and admin has the user role, the roles list will be longer than 1
        if (user.getUserId() != currentUser.getUserId() && currentUser.getRoles().size() == 1)
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "The design belongs to another user");
        }
        // Create the design, assign it to the collection and persist itr
        Design newDesign = new Design();
        newDesign.setDesignType(design.getDesignType());
        newDesign.setDesignProperties(design.getDesignProperties());
        newDesign.setUser(user);
        return designRepository.save(newDesign);
    }
    // TODO: Update endpoint
    // TODO: DELETE endpoint

    /*
    Get ALL /designs
    Get all of specific user /designs/{userId}
    Get specific design /designs/{designId}
    Get all of my designs /designs/me
    Get one of my designs /designs/me/{designId}


     */
}
