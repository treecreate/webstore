package dk.treecreate.api.transactionitem;

import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.designs.Design;
import dk.treecreate.api.designs.DesignDimension;
import dk.treecreate.api.designs.DesignRepository;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import dk.treecreate.api.transactionitem.dto.CreateBulkTransactionItemsRequest;
import dk.treecreate.api.transactionitem.dto.CreateTransactionItemRequest;
import dk.treecreate.api.transactionitem.dto.GetTransactionItemsResponse;
import dk.treecreate.api.transactionitem.dto.UpdateTransactionItemRequest;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("transaction-items")
@Api(tags = {"Transaction Items"})
public class TransactionItemController
{

    @Autowired
    TransactionItemRepository transactionItemRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    DesignRepository designRepository;
    @Autowired
    AuthUserService authUserService;

    @GetMapping()
    @Operation(summary = "Get all transaction items")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "A list of transaction items",
            response = GetTransactionItemsResponse.class)})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public List<TransactionItem> getAll()
    {
        return transactionItemRepository.findAll();
    }

    @GetMapping("/me")
    @Operation(summary = "Get all transaction items associated with the current user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "A list of transaction items",
            response = GetTransactionItemsResponse.class)})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public List<TransactionItem> getCurrent()
    {
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var items = transactionItemRepository.findByUserId(user.getUserId());
        items.removeIf(item -> (item.getOrderId() != null));
        return items;
    }

    @GetMapping("{transactionItemId}")
    @Operation(summary = "Get a transaction item")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Transaction item information",
            response = TransactionItem.class),
        @ApiResponse(code = 404, message = "Transaction item not found")})
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('ADMIN')")
    public TransactionItem getTransactionItem(
        @ApiParam(name = "transactionItemId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID transactionItemId)
    {
        return transactionItemRepository.findByTransactionItemId(transactionItemId)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction item not found"));
    }

    @GetMapping("me/{transactionItemId}")
    @Operation(summary = "Get a transaction item associated with the current user")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Transaction item information",
            response = TransactionItem.class),
        @ApiResponse(code = 404, message = "Transaction item not found")})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public TransactionItem getCurrentTransactionItem(
        @ApiParam(name = "transactionItemId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID transactionItemId)
    {
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var transactionItem = transactionItemRepository.findByTransactionItemId(transactionItemId)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction item not found"));

        if (transactionItem.getDesign().getUser().getUserId() != user.getUserId())
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "You lack clearance to view this resource");
        }
        return transactionItem;
    }

    @PostMapping("me")
    @Operation(summary = "Create a transaction item")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Transaction item information",
            response = TransactionItem.class),
        @ApiResponse(code = 403, message = "You lack clearance to use this design resource"),
        @ApiResponse(code = 404, message = "Design not found")})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public TransactionItem create(
        @RequestBody() @Valid CreateTransactionItemRequest createTransactionItemRequest)
    {
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        TransactionItem transactionItem = new TransactionItem();
        Design design = designRepository.findByDesignId(createTransactionItemRequest.getDesignId())
            .orElseThrow(() -> new ResourceNotFoundException("Design not found"));

        if (design.getUser().getUserId() != user.getUserId())
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "You lack clearance to use this design resource");
        }

        // check if the design type allows the given dimension
        switch (design.getDesignType())
        {
            case FAMILY_TREE:
                if (createTransactionItemRequest.getDimension().equals(DesignDimension.ONE_SIZE))
                {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Design of type 'FAMILY_TREE' can't be saved with dimension 'ONE_SIZE'");
                }
                break;
            case QUOTABLE:
                if (createTransactionItemRequest.getDimension().equals(DesignDimension.ONE_SIZE))
                {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Design of type 'QUOTABLE' can't be saved with dimension 'ONE_SIZE'");
                }
                break;
            default:
                break;
        }

        transactionItem.setDesign(design);
        transactionItem.setDimension(createTransactionItemRequest.getDimension());
        transactionItem.setQuantity(createTransactionItemRequest.getQuantity());
        return transactionItemRepository.save(transactionItem);
    }

    @PostMapping("me/bulk")
    @Operation(
        summary = "Create multiple transaction items and their designs with a single request")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "List of transaction items and their designs",
            response = GetTransactionItemsResponse.class)})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    @Transactional()
    public List<TransactionItem> createBulk(
        @RequestBody() @Valid CreateBulkTransactionItemsRequest createTransactionItemRequest)
    {
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var createdItems = new ArrayList<TransactionItem>();
        for (var item : createTransactionItemRequest.getTransactionItems())
        {
            TransactionItem transactionItem = new TransactionItem();

            // check if the design type allows the given dimension
            switch (item.getDesign().getDesignType())
            {
                case FAMILY_TREE:
                    if (item.getDimension().equals(DesignDimension.ONE_SIZE))
                    {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Design of type 'FAMILY_TREE' can't be saved with dimension 'ONE_SIZE'");
                    }
                    break;
                default:
                    break;
            }

            // save the design
            Design design = new Design();
            design.setDesignType(item.getDesign().getDesignType());
            design.setDesignProperties(item.getDesign().getDesignProperties());
            design.setMutable(false);
            design.setUser(user);
            design = this.designRepository.save(design);

            transactionItem.setDesign(design);
            transactionItem.setDimension(item.getDimension());
            transactionItem.setQuantity(item.getQuantity());

            createdItems.add(transactionItemRepository.save(transactionItem));
        }
        return createdItems;
    }


    @PutMapping("me/{transactionItemId}")
    @Operation(summary = "Update a transaction item")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Transaction item information",
            response = TransactionItem.class),
        @ApiResponse(code = 403, message = "You lack clearance to modify this resource"),
        @ApiResponse(code = 404, message = "Transaction item not found")})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public TransactionItem update(
        @ApiParam(name = "transactionItemId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID transactionItemId,
        @RequestBody() @Valid UpdateTransactionItemRequest updateTransactionItemRequest)
    {
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var transactionItem = transactionItemRepository.findByTransactionItemId(transactionItemId)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction item not found"));
        if (transactionItem.getDesign().getUser().getUserId() != user.getUserId())
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "You lack clearance to modify this resource");
        }
        transactionItem.setDimension(updateTransactionItemRequest.getDimension());
        transactionItem.setQuantity(updateTransactionItemRequest.getQuantity());
        return transactionItemRepository.save(transactionItem);
    }

    @DeleteMapping("me/{transactionItemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a transaction item")
    @ApiResponses(value = {
        @ApiResponse(code = 204, message = "Transaction item has been deleted"),
        @ApiResponse(code = 403, message = "You lack clearance to delete this resource")})
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
    public void delete(
        @ApiParam(name = "transactionItemId", example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
        @PathVariable UUID transactionItemId)
    {
        var userDetails = authUserService.getCurrentlyAuthenticatedUser();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var transactionItem = transactionItemRepository.findByTransactionItemId(transactionItemId)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction item not found"));
        if (transactionItem.getDesign().getUser().getUserId() != user.getUserId())
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "You lack clearance to delete this resource");
        }
        transactionItemRepository.delete(transactionItem);
    }
}
