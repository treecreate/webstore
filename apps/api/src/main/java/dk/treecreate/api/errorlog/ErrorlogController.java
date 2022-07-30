package dk.treecreate.api.errorlog;

import dk.treecreate.api.errorlog.dto.CreateErrorlogRequest;
import dk.treecreate.api.errorlog.dto.GetErrorlogsResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("errorlogs")
@Api(tags = {"Errorlogs"})
public class ErrorlogController
{
    @Autowired
    ErrorlogRepository errorlogRepository;

    @GetMapping()
    @Operation(summary = "Get all errorlogs")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "A list of errorlogs",
            response = GetErrorlogsResponse.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public List<Errorlog> getErrorlogs(
        @Parameter(name = "name", description = "Errorlog name",
            example = "webstore.login.login-failed")
        @RequestParam(required = false) String name,
        @Parameter(name = "userId", description = "Errorlog userId",
            example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @RequestParam(
            required = false) UUID userId)
    {
        if (name != null && userId != null)
        {
            return errorlogRepository.findByNameAndUserId(name, userId);
        } else if (name != null && userId == null)
        {
            return errorlogRepository.findByName(name);
        } else if (name == null && userId != null)
        {
            return errorlogRepository.findByUserId(userId);
        } else
        {
            return errorlogRepository.findAll();
        }
    }

    @PostMapping()
    @Operation(summary = "Create a new errorlog")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Errorlog information",
            response = Errorlog.class)})
    public Errorlog createErrorlog(
        @RequestBody @Valid CreateErrorlogRequest request
    )
    {
        Errorlog errorlog = new Errorlog();
        errorlog.setName(request.getName());
        errorlog.setUserId(request.getUserId());
        errorlog.setBrowser(request.getBrowser());
        errorlog.setUrl(request.getUrl());
        errorlog.setProduction(request.getProduction());
        if (request.getError() != null)
        {
            errorlog.setError(request.getError());
        }
        return errorlogRepository.save(errorlog);
    }
}
