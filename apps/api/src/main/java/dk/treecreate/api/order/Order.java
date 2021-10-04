package dk.treecreate.api.order;

import dk.treecreate.api.contactinfo.ContactInfo;
import dk.treecreate.api.discount.Discount;
import dk.treecreate.api.discount.DiscountType;
import dk.treecreate.api.transactionitem.TransactionItem;
import dk.treecreate.api.user.User;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
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

    @Basic
    @ApiModelProperty(example = "DiscountRelease2021", required = true)
    @Column(name = "discount_code", length = 50, nullable = false)
    private String discountCode;

    @Column(name = "type", nullable = false)
    @ApiModelProperty(notes = "Discount type", example = "PERCENT", required = true)
    private DiscountType type = DiscountType.AMOUNT;

    @Column(name = "state", nullable = false)
    @ApiModelProperty(notes = "State of the quickpay payment", example = "PENDING")
    private PaymentState state;


    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @ApiModelProperty(notes = "Discount used in the given order")
    private Discount discount;

    @OneToOne(optional = false)
    @ApiModelProperty(notes = "Contact info for the given order")
    private ContactInfo contactInfo;

    @OneToOne(optional = false)
    @ApiModelProperty(notes = "Billing info for the given order")
    private ContactInfo billingInfo;

    @OneToMany()
    @ApiModelProperty(notes = "Transaction items of the given order")
    private List<TransactionItem> transactionItems;

    @ApiModelProperty(name = "Date the discount entry was created at",
        example = "2021-08-31T19:40:10.000+00:00")
    @CreationTimestamp
    private Date createdAt;

}
