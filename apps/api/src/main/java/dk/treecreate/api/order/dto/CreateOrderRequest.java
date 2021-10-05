package dk.treecreate.api.order.dto;

import dk.treecreate.api.contactinfo.dto.CreateContactInfoRequest;
import dk.treecreate.api.order.Currency;
import dk.treecreate.api.order.PaymentState;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class CreateOrderRequest
{
    @NotNull
    @ApiModelProperty(name = "Raw price of the products", example = "1000.00", required = true)
    private BigDecimal initialPrice;

    @NotNull
    @ApiModelProperty(name = "Price with the discounts applies", example = "750.00",
        required = true)
    private BigDecimal fullPrice;

    @NotNull
    @ApiModelProperty(notes = "Currency", example = "dkk", required = false)
    private Currency currency = Currency.DKK;

    @NotNull
    @ApiModelProperty(notes = "State of the quickpay payment", example = "PENDING",
        required = false)
    private PaymentState state = PaymentState.INITIAL;

    @ApiModelProperty(notes = "ID of the discount used in the given order")
    private UUID discountId;

    @NotNull
    @ApiModelProperty(notes = "Contact information for the given order", required = true)
    private CreateContactInfoRequest contactInfo;

    @ApiModelProperty(
        notes = "Billing information for the given order")
    private CreateContactInfoRequest billingInfo;

    @NotEmpty
    @ApiModelProperty(notes = "List of transaction item IDs", required = true)
    private List<UUID> transactionItemIds;

    public BigDecimal getInitialPrice()
    {
        return initialPrice;
    }

    public void setInitialPrice(BigDecimal initialPrice)
    {
        this.initialPrice = initialPrice;
    }

    public BigDecimal getFullPrice()
    {
        return fullPrice;
    }

    public void setFullPrice(BigDecimal fullPrice)
    {
        this.fullPrice = fullPrice;
    }

    public Currency getCurrency()
    {
        return currency;
    }

    public void setCurrency(Currency currency)
    {
        this.currency = currency;
    }

    public PaymentState getState()
    {
        return state;
    }

    public void setState(PaymentState state)
    {
        this.state = state;
    }

    public UUID getDiscountId()
    {
        return discountId;
    }

    public void setDiscountId(UUID discountId)
    {
        this.discountId = discountId;
    }

    public CreateContactInfoRequest getContactInfo()
    {
        return contactInfo;
    }

    public void setContactInfo(CreateContactInfoRequest contactInfo)
    {
        this.contactInfo = contactInfo;
    }

    public CreateContactInfoRequest getBillingInfo()
    {
        return billingInfo;
    }

    public void setBillingInfo(CreateContactInfoRequest billingInfo)
    {
        this.billingInfo = billingInfo;
    }

    public List<UUID> getTransactionItemIds()
    {
        return transactionItemIds;
    }

    public void setTransactionItemIds(List<UUID> transactionItemIds)
    {
        this.transactionItemIds = transactionItemIds;
    }
}
