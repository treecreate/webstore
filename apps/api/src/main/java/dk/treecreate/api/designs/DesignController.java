package dk.treecreate.api.designs;

import dk.treecreate.api.authentication.models.ERole;
import dk.treecreate.api.authentication.models.Role;
import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.designs.dto.CreateDesignRequest;
import dk.treecreate.api.designs.dto.GetAllDesignsResponse;
import dk.treecreate.api.designs.dto.UpdateDesignRequest;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import dk.treecreate.api.transactionitem.TransactionItem;
import dk.treecreate.api.transactionitem.TransactionItemRepository;
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
    TransactionItemRepository transactionItemRepository;

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
            // Determine whether the user is an admin or not
            boolean isAdmin = false;
            var roles = currentUser.getRoles();
            for (Role role : roles)
            {
                if (role.getName().equals(ERole.ROLE_ADMIN))
                {
                    isAdmin = true;
                    break;
                }
            }
            if (!isAdmin)
            {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "The design belongs to another user");
            }
            // make sure that the admin doesn't accidentally change the design
            design.setMutable(false);
        }
        return design;
    }

    @PostMapping()
    @Operation(summary = "Create a new design entity")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Design information",
            response = Design.class),})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public Design create(@Valid @RequestBody CreateDesignRequest createDesignRequest)
    {
        // Get currently authenticated user
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // Create the design, assign the user to it and persist it
        Design newDesign = new Design();
        newDesign.setDesignType(createDesignRequest.getDesignType());
        newDesign.setDesignProperties(createDesignRequest.getDesignProperties());
        newDesign.setMutable(createDesignRequest.isMutable());
        newDesign.setUser(currentUser);
        return designRepository.save(newDesign);
    }

    @PutMapping()
    @Operation(summary = "Update design. Only possible for design owner.")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Design entity.",
            response = Design.class),
        @ApiResponse(code = 404, message = "Design not found.")
    })
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public Design update(
        @RequestBody() @Valid UpdateDesignRequest updateDesignRequest)
    {
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Design design = designRepository.findByDesignId(updateDesignRequest.getDesignId())
            .orElseThrow(() -> new ResourceNotFoundException("Design not found"));
        if (design.getUser().getUserId() != currentUser.getUserId())
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "The design belongs to another user");
        }

        if (!design.isMutable())
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "The design can't be updated");
        }
        design.setDesignType(updateDesignRequest.getDesignType());
        design.setDesignProperties(updateDesignRequest.getDesignProperties());
        return designRepository.save(design);
    }

    @DeleteMapping("{designId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete design. Only possible for design owner.")
    @ApiResponses(value = {
        @ApiResponse(code = 204, message = "Design is removed."),
        @ApiResponse(code = 404, message = "Design not found.")
    })
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public void delete(
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
        var items = transactionItemRepository.findByDesignId(design.getDesignId());
        for (TransactionItem item : items
        )
        {
            item.setDesign(null);
            transactionItemRepository.save(item);
        }
        designRepository.delete(design);
    }

}
