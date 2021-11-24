package dk.treecreate.api.transactionitem.dto;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

public class CreateBulkTransactionItemsRequest
{
    @ApiModelProperty(notes = "A list of transaction items", required = true)
    @NotNull
    @Valid
    List<CreateBulkTransactionItemRequest> transactionItems;

    public List<CreateBulkTransactionItemRequest> getTransactionItems()
    {
        return transactionItems;
    }

    public void setTransactionItems(List<CreateBulkTransactionItemRequest> transactionItems)
    {
        this.transactionItems = transactionItems;
    }
}
