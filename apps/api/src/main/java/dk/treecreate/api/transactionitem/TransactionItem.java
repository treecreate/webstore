package dk.treecreate.api.transactionitem;

import dk.treecreate.api.designs.Design;
import dk.treecreate.api.designs.DesignDimension;
import dk.treecreate.api.order.Order;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "transaction_items")
public class TransactionItem
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
    @ApiModelProperty(notes = "UUID of the transaction item entity",
        example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
    private UUID transactionItemId;

    @Basic
    @ApiModelProperty(notes = "The quantity of how many items are included", example = "1")
    @Column(name = "quantity", nullable = false)
    private int quantity = 1;

    @Basic
    @ApiModelProperty(notes = "The dimension of the referenced design", example = "SMALL")
    @Column(name = "dimension", nullable = false)
    private DesignDimension dimension = DesignDimension.ONE_SIZE;

    // TODO: eager-load instead
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    private Design design;

    @Type(type = "uuid-char")
    @Column(name = "order_id", nullable = true)
    @ApiModelProperty(notes = "Id of the order",
        example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
    private UUID orderId;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    private Order order;

    @ApiModelProperty(name = "Date the entity was created at",
        example = "2021-08-31T19:40:10.000+00:00")
    @CreationTimestamp
    private Date createdAt;

    @ApiModelProperty(name = "Date the entity was updated at",
        example = "2021-08-31T19:40:10.000+00:00")
    @UpdateTimestamp
    private Date updatedAt;

    public UUID getTransactionItemId()
    {
        return transactionItemId;
    }

    public void setTransactionItemId(UUID transactionItemId)
    {
        this.transactionItemId = transactionItemId;
    }

    public int getQuantity()
    {
        return quantity;
    }

    public void setQuantity(int quantity)
    {
        this.quantity = quantity;
    }

    public DesignDimension getDimension()
    {
        return dimension;
    }

    public void setDimension(DesignDimension dimension)
    {
        this.dimension = dimension;
    }

    public Design getDesign()
    {
        return design;
    }

    public void setDesign(Design design)
    {
        this.design = design;
    }

    public void setOrder(Order order)
    {
        this.order = order;
        this.orderId = order.getOrderId();
    }

    public UUID getOrderId()
    {
        return orderId;
    }

    public void setOrderId(UUID orderId)
    {
        this.orderId = orderId;
    }

    public Date getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt)
    {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt()
    {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt)
    {
        this.updatedAt = updatedAt;
    }

    @Override public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TransactionItem that = (TransactionItem) o;
        return quantity == that.quantity && transactionItemId.equals(that.transactionItemId) &&
            dimension == that.dimension && design.equals(that.design);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(transactionItemId, quantity, dimension, design);
    }

    // TODO: Add Order field/relation

}
