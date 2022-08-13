package dk.treecreate.api.order;

import dk.treecreate.api.contactinfo.ContactInfo;
import dk.treecreate.api.discount.Discount;
import dk.treecreate.api.transactionitem.TransactionItem;
import dk.treecreate.api.utils.OrderStatus;
import dk.treecreate.api.utils.model.quickpay.Currency;
import dk.treecreate.api.utils.model.quickpay.ShippingMethod;
import io.swagger.annotations.ApiModelProperty;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.Min;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "orders")
public class Order {
  @Id
  @GeneratedValue(generator = "UUID")
  @GenericGenerator(
      name = "UUID",
      strategy = "org.hibernate.id.UUIDGenerator",
      parameters = {
        @org.hibernate.annotations.Parameter(
            name = "uuid_gen_strategy_class",
            value = "org.hibernate.id.uuid.CustomVersionOneStrategy")
      })
  @Type(type = "uuid-char")
  @Column(name = "order_id", updatable = false, nullable = false)
  @ApiModelProperty(
      notes = "UUID of the design entity",
      example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
  private UUID orderId;

  @Basic
  @ApiModelProperty(name = "Raw price of the products", example = "1000.00", required = true)
  @Column(name = "subtotal", precision = 16, scale = 2, nullable = false)
  private BigDecimal subtotal;

  @Basic
  @ApiModelProperty(
      name = "Price with the discount etc applied",
      example = "750.00",
      required = true)
  @Column(name = "total", precision = 16, scale = 2, nullable = false)
  private BigDecimal total;

  @Column(name = "currency", nullable = false)
  @ApiModelProperty(notes = "Currency", example = "dkk", required = false)
  private Currency currency = Currency.DKK;

  @Column(name = "status", nullable = false)
  @ApiModelProperty(notes = "Status of the quickpay payment", example = "PENDING")
  private OrderStatus status;

  @Min(1)
  @Column(name = "planted_trees", nullable = false)
  @ApiModelProperty(notes = "How many planted trees the order has. Default is 1", example = "1")
  private int plantedTrees = 1;

  @Column(name = "payment_id", nullable = false)
  @ApiModelProperty(notes = "Id of the Quickpay payment", example = "271514001")
  private String paymentId;

  // The userId is not a relation because 1. JPA sucks, and 2. Doesn't need to be
  @Type(type = "uuid-char")
  @Column(name = "user_id", nullable = false)
  @ApiModelProperty(
      notes = "Id of the order's user",
      example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
  private UUID userId;

  @Column(name = "shipping_method", nullable = false)
  @ApiModelProperty(
      notes = "Shipping method by which the customer receives their order",
      example = "HOME_DELIVERY")
  private ShippingMethod shippingMethod;

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

  @ApiModelProperty(
      name = "Date the entity was created at",
      example = "2021-08-31T19:40:10.000+00:00")
  @CreationTimestamp
  private Date createdAt;

  @ApiModelProperty(
      name = "Date the entity was updated at",
      example = "2021-08-31T19:40:10.000+00:00")
  @UpdateTimestamp
  private Date updatedAt;

  public UUID getOrderId() {
    return orderId;
  }

  public void setOrderId(UUID orderId) {
    this.orderId = orderId;
  }

  public BigDecimal getSubtotal() {
    return subtotal;
  }

  public void setSubtotal(BigDecimal subtotal) {
    this.subtotal = subtotal;
  }

  public BigDecimal getTotal() {
    return total;
  }

  public void setTotal(BigDecimal total) {
    this.total = total;
  }

  public Currency getCurrency() {
    return currency;
  }

  public void setCurrency(Currency currency) {
    this.currency = currency;
  }

  public OrderStatus getStatus() {
    return status;
  }

  public void setStatus(OrderStatus status) {
    this.status = status;
  }

  public int getPlantedTrees() {
    return plantedTrees;
  }

  public void setPlantedTrees(int plantedTrees) {
    this.plantedTrees = plantedTrees;
  }

  public String getPaymentId() {
    return paymentId;
  }

  public void setPaymentId(String paymentId) {
    this.paymentId = paymentId;
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public ShippingMethod getShippingMethod() {
    return shippingMethod;
  }

  public void setShippingMethod(ShippingMethod shippingMethod) {
    this.shippingMethod = shippingMethod;
  }

  public Discount getDiscount() {
    return discount;
  }

  public void setDiscount(Discount discount) {
    this.discount = discount;
  }

  public ContactInfo getContactInfo() {
    return contactInfo;
  }

  public void setContactInfo(ContactInfo contactInfo) {
    this.contactInfo = contactInfo;
  }

  public ContactInfo getBillingInfo() {
    return billingInfo;
  }

  public void setBillingInfo(ContactInfo billingInfo) {
    this.billingInfo = billingInfo;
  }

  public List<TransactionItem> getTransactionItems() {
    return transactionItems;
  }

  public void setTransactionItems(List<TransactionItem> transactionItems) {
    this.transactionItems = transactionItems;
  }

  public Date getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Date createdAt) {
    this.createdAt = createdAt;
  }

  public Date getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(Date updatedAt) {
    this.updatedAt = updatedAt;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Order order = (Order) o;
    return plantedTrees == order.plantedTrees
        && orderId.equals(order.orderId)
        && subtotal.equals(order.subtotal)
        && total.equals(order.total)
        && currency == order.currency
        && status == order.status
        && Objects.equals(userId, order.userId)
        && shippingMethod == order.shippingMethod
        && Objects.equals(discount, order.discount)
        && Objects.equals(contactInfo, order.contactInfo)
        && Objects.equals(billingInfo, order.billingInfo)
        && Objects.equals(transactionItems, order.transactionItems)
        && Objects.equals(createdAt, order.createdAt);
  }

  @Override
  public int hashCode() {
    return Objects.hash(
        orderId,
        subtotal,
        total,
        currency,
        status,
        plantedTrees,
        userId,
        shippingMethod,
        discount,
        contactInfo,
        billingInfo,
        transactionItems,
        createdAt);
  }
}
