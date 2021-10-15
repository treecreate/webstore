package dk.treecreate.api.order.dto;

import dk.treecreate.api.contactinfo.dto.CreateContactInfoRequest;
import dk.treecreate.api.utils.model.quickpay.Currency;
import dk.treecreate.api.utils.model.quickpay.PaymentState;
import dk.treecreate.api.utils.model.quickpay.ShippingMethod;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.Column;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class CreateOrderRequest
{
    @NotNull
    @ApiModelProperty(name = "Raw price of the products", example = "1000.00", required = true)
    private BigDecimal subtotal;

    @NotNull
    @ApiModelProperty(name = "Price with the discount etc applied", example = "750.00",
        required = true)
    private BigDecimal total;

    @NotNull
    @ApiModelProperty(notes = "Currency", example = "dkk", required = false)
    private Currency currency = Currency.DKK;

    @NotNull
    @ApiModelProperty(notes = "State of the quickpay payment", example = "PENDING",
        required = false)
    private PaymentState state = PaymentState.INITIAL;

    @Min(1)
    @ApiModelProperty(name = "How many planted trees the order has. Default is 1", example = "1",
        required = false)
    private int plantedTrees = 1;

    @NotNull
    @ApiModelProperty(notes = "Shipping method by which the customer receives their order",
        example = "HOME_DELIVERY", required = true)
    private ShippingMethod shippingMethod;

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

    public BigDecimal getSubtotal()
    {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal)
    {
        this.subtotal = subtotal;
    }

    public BigDecimal getTotal()
    {
        return total;
    }

    public void setTotal(BigDecimal total)
    {
        this.total = total;
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

    public int getPlantedTrees()
    {
        return plantedTrees;
    }

    public void setPlantedTrees(int plantedTrees)
    {
        this.plantedTrees = plantedTrees;
    }

    public ShippingMethod getShippingMethod()
    {
        return shippingMethod;
    }

    public void setShippingMethod(ShippingMethod shippingMethod)
    {
        this.shippingMethod = shippingMethod;
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
