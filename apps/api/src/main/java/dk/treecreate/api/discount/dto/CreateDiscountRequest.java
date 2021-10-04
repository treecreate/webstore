package dk.treecreate.api.discount.dto;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;

public class CreateDiscountRequest
{
    @NotNull
    @Length(max = 50, min = 1)
    @ApiModelProperty(example = "DiscountRelease2021", required = true)
    private String discountCode;

    @NotNull
    @Min(0)
    @ApiModelProperty(name = "How many more times the discount can be used", example = "0",
        required = true)
    private int remainingUses = 0;

    @NotNull
    @Min(0)
    @ApiModelProperty(name = "How many times the discount has been used", example = "1",
        required = true)
    private int totalUses = 0;

    @ApiModelProperty(name = "Date after which the discount can no longer be used",
        example = "2021-08-31T19:40:10.000+00:00", required = false)
    private Date expiresAt;

    public String getDiscountCode()
    {
        return discountCode;
    }

    public void setDiscountCode(String discountCode)
    {
        this.discountCode = discountCode;
    }

    public int getRemainingUses()
    {
        return remainingUses;
    }

    public void setRemainingUses(int remainingUses)
    {
        this.remainingUses = remainingUses;
    }

    public int getTotalUses()
    {
        return totalUses;
    }

    public void setTotalUses(int totalUses)
    {
        this.totalUses = totalUses;
    }

    public Date getExpiresAt()
    {
        return expiresAt;
    }

    public void setExpiresAt(Date expiresAt)
    {
        this.expiresAt = expiresAt;
    }
}
