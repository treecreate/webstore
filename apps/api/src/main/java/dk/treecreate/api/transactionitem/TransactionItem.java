package dk.treecreate.api.transactionitem;

import dk.treecreate.api.designs.Design;
import dk.treecreate.api.designs.DesignDimension;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
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
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private Design design;

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
