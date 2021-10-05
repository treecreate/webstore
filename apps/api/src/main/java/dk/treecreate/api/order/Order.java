package dk.treecreate.api.order;

import dk.treecreate.api.contactinfo.ContactInfo;
import dk.treecreate.api.discount.Discount;
import dk.treecreate.api.transactionitem.TransactionItem;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order
{
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
        name = "UUID",
        strategy = "org.hibernate.id.UUIDGenerator",
        parameters = {
            @org.hibernate.annotations.Parameter(
                name = "uuid_gen_strategy_class",
                value = "org.hibernate.id.uuid.CustomVersionOneStrategy"
            )
        }
    )
    @Type(type = "uuid-char")
    @Column(name = "order_id", updatable = false, nullable = false)
    @ApiModelProperty(notes = "UUID of the design entity",
        example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
    private UUID orderId;

    @Basic
    @ApiModelProperty(example = "1000.00", required = true)
    @Column(name = "initial_price", precision = 16, scale = 2, nullable = false)
    private BigDecimal initialPrice;

    @Basic
    @ApiModelProperty(example = "750.00", required = true)
    @Column(name = "full_price", precision = 16, scale = 2, nullable = false)
    private BigDecimal fullPrice;

    @Column(name = "currency", nullable = false)
    @ApiModelProperty(notes = "Currency", example = "dkk", required = false)
    private Currency currency = Currency.DKK;

    @Column(name = "state", nullable = false)
    @ApiModelProperty(notes = "State of the quickpay payment", example = "PENDING")
    private PaymentState state;

    // The userId is not a relation because 1. JPA sucks, and 2. Doesn't need to be
    @Column(name = "user_id", nullable = false)
    @ApiModelProperty(notes = "Id of the order's user",
        example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
    private UUID userId;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @ApiModelProperty(notes = "Discount used in the given order")
    private Discount discount;

    @OneToOne(optional = false, cascade = CascadeType.ALL)
    @ApiModelProperty(notes = "Contact info for the given order")
    private ContactInfo contactInfo;

    @OneToOne(optional = true, cascade = CascadeType.ALL)
    @ApiModelProperty(notes = "Billing info for the given order")
    private ContactInfo billingInfo;

    @OneToMany()
    @ApiModelProperty(notes = "Transaction items of the given order")
    private List<TransactionItem> transactionItems;

    @ApiModelProperty(name = "Date the discount entry was created at",
        example = "2021-08-31T19:40:10.000+00:00")
    @CreationTimestamp
    private Date createdAt;

    public UUID getOrderId()
    {
        return orderId;
    }

    public void setOrderId(UUID orderId)
    {
        this.orderId = orderId;
    }

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

    public UUID getUserId()
    {
        return userId;
    }

    public void setUserId(UUID userId)
    {
        this.userId = userId;
    }

    public Discount getDiscount()
    {
        return discount;
    }

    public void setDiscount(Discount discount)
    {
        this.discount = discount;
    }

    public ContactInfo getContactInfo()
    {
        return contactInfo;
    }

    public void setContactInfo(ContactInfo contactInfo)
    {
        this.contactInfo = contactInfo;
    }

    public ContactInfo getBillingInfo()
    {
        return billingInfo;
    }

    public void setBillingInfo(ContactInfo billingInfo)
    {
        this.billingInfo = billingInfo;
    }

    public List<TransactionItem> getTransactionItems()
    {
        return transactionItems;
    }

    public void setTransactionItems(List<TransactionItem> transactionItems)
    {
        this.transactionItems = transactionItems;
    }

    public Date getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt)
    {
        this.createdAt = createdAt;
    }

    @Override public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Order order = (Order) o;
        return orderId.equals(order.orderId) && initialPrice.equals(order.initialPrice) &&
            fullPrice.equals(order.fullPrice) && currency == order.currency &&
            state == order.state && userId.equals(order.userId) &&
            Objects.equals(discount, order.discount) &&
            Objects.equals(contactInfo, order.contactInfo) &&
            Objects.equals(billingInfo, order.billingInfo) &&
            Objects.equals(transactionItems, order.transactionItems) &&
            Objects.equals(createdAt, order.createdAt);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(orderId, initialPrice, fullPrice, currency, state, userId, discount,
            contactInfo, billingInfo, transactionItems, createdAt);
    }
}
