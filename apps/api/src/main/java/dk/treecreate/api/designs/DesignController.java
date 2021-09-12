package dk.treecreate.api.designs;

import dk.treecreate.api.designs.dto.CreateDesignRequest;
import dk.treecreate.api.newsletter.Newsletter;
import dk.treecreate.api.newsletter.dto.GetNewslettersResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("designs")
@Api(tags = {"designs"})
public class DesignController
{

    @Autowired
    DesignRepository designRepository;

    @GetMapping()
    @Operation(summary = "Get all designs")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "A list of designs",
            response = GetNewslettersResponse.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public List<Design> getAll()
    {
        return designRepository.findAll();
    }


    @PostMapping()
    @Operation(summary = "Create a new design entity")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Design information",
            response = Newsletter.class),})
    public Design create(@Valid @RequestBody CreateDesignRequest design)
    {
        Design newDesign = new Design();
        System.out.println(design.getDesignType());
        newDesign.setDesignType(design.getDesignType());
        newDesign.setDesignProperties(design.getDesignProperties());
        return designRepository.save(newDesign);
    }
}
