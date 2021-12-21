package dk.treecreate.api.discount.dto;

import dk.treecreate.api.discount.DiscountType;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;
import java.util.Date;

public class UpdateDiscountRequest
{

    @Length(min = 1, max = 50)
    @ApiModelProperty(example = "DiscountRelease2021")
    private String discountCode;

    @ApiModelProperty(notes = "Discount type", example = "PERCENT")
    private DiscountType type;

    @Min(0)
    @ApiModelProperty(name = "The amount the discount provides", example = "0")
    private Integer amount;

    @Min(0)
    @ApiModelProperty(name = "How many more times the discount can be used", example = "0")
    private Integer remainingUses;

    @Min(0)
    @ApiModelProperty(name = "How many times the discount has been used", example = "1")
    private int totalUses;

    @ApiModelProperty(name = "Date after which the discount can no longer be used",
        example = "2021-08-31T19:40:10.000+00:00")
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

    public Integer getAmount()
    {
        return amount;
    }

    public void setAmount(int amount)
    {
        this.amount = amount;
    }

    public Integer getRemainingUses()
    {
        return remainingUses;
    }

    public void setRemainingUses(int remainingUses)
    {
        this.remainingUses = remainingUses;
    }

    public Integer getTotalUses()
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

    @Override public String toString()
    {
        return "UpdateDiscountRequest{" +
            "discountCode='" + discountCode + '\'' +
            ", type=" + type +
            ", amount=" + amount +
            ", remainingUses=" + remainingUses +
            ", totalUses=" + totalUses +
            ", expiresAt=" + expiresAt +
            '}';
    }
}
