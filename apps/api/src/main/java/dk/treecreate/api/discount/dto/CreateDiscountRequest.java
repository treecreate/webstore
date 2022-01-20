package dk.treecreate.api.discount.dto;

import dk.treecreate.api.discount.DiscountType;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;

public class CreateDiscountRequest
{
    @NotEmpty
    @Length(max = 50, min = 1)
    @ApiModelProperty(example = "DiscountRelease2021", required = true)
    private String discountCode;

    @NotNull
    @ApiModelProperty(notes = "Discount type", example = "PERCENT", required = true)
    private DiscountType type;

    @NotNull
    @Min(0)
    @ApiModelProperty(name = "The amount the discount provides", example = "0",
        required = true)
    private Integer amount;

    @NotNull
    @Min(0)
    @ApiModelProperty(name = "How many more times the discount can be used", example = "0",
        required = true)
    private Integer remainingUses;

    @NotNull
    @Min(0)
    @ApiModelProperty(name = "How many times the discount has been used", example = "1",
        required = true)
    private Integer totalUses;

    @ApiModelProperty(notes = "Can the discount be used", example = "1")
    private Boolean isEnabled = true;

    @ApiModelProperty(name = "Date after which the discount can be used",
        example = "2021-08-31T19:40:10.000+00:00", required = false)
    private Date startsAt;

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

    public DiscountType getType()
    {
        return type;
    }

    public void setType(DiscountType type)
    {
        this.type = type;
    }

    public int getAmount()
    {
        return amount;
    }

    public void setAmount(int amount)
    {
        this.amount = amount;
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

    public boolean getIsEnabled()
    {
        return isEnabled;
    }

    public void setIsEnabled(boolean isEnabled)
    {
        this.isEnabled = isEnabled;
    }

    public Date getStartsAt()
    {
        return startsAt;
    }

    public void setStartsAt(Date startsAt)
    {
        this.startsAt = startsAt;
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
