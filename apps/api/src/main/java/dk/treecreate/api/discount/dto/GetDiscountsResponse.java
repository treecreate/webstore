package dk.treecreate.api.discount.dto;

import dk.treecreate.api.discount.Discount;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

public class GetDiscountsResponse
{
    @ApiModelProperty(notes = "A list of discounts")
    List<Discount> discounts;

    public List<Discount> getDiscounts()
    {
        return discounts;
    }

    public void setDiscounts(List<Discount> discounts)
    {
        this.discounts = discounts;
    }
}
