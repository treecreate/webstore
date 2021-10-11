package dk.treecreate.api.transactionitem.dto;

import dk.treecreate.api.transactionitem.TransactionItem;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

public class GetTransactionItemsResponse
{
    @ApiModelProperty(notes = "A list of transaction items")
    List<TransactionItem> transactionItems;
}
