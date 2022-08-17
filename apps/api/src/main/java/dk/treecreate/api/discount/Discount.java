package dk.treecreate.api.discount;

import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.Min;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(
    name = "discounts",
    uniqueConstraints = {
      @UniqueConstraint(columnNames = "discount_code"),
    })
public class Discount {
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
  @Column(name = "discount_id", updatable = false, nullable = false)
  @ApiModelProperty(
      notes = "UUID of the user entity",
      example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
  private UUID discountId;

  @Basic
  @ApiModelProperty(example = "DiscountRelease2021", required = true)
  @Column(name = "discount_code", length = 50, nullable = false)
  private String discountCode;

  @Column(name = "type", nullable = false)
  @ApiModelProperty(notes = "Discount type", example = "PERCENT", required = true)
  private DiscountType type = DiscountType.AMOUNT;

  @Basic
  @Min(0)
  @ApiModelProperty(name = "The amount the discount provides", example = "0", required = true)
  @Column(name = "amount", nullable = false)
  private int amount = 0;

  @Basic
  @Min(0)
  @ApiModelProperty(
      name = "How many more times the discount can be used",
      example = "0",
      required = true)
  @Column(name = "remaining_uses", nullable = false)
  private int remainingUses = 0;

  @Basic
  @Min(0)
  @ApiModelProperty(
      name = "How many times the discount has been used",
      example = "1",
      required = true)
  @Column(name = "total_uses", nullable = false)
  private int totalUses = 0;

  @ApiModelProperty(
      name = "Date after which the discount can be used",
      example = "2021-08-31T19:40:10.000+00:00")
  @Column(name = "starts_at", nullable = true)
  private Date startsAt = new Date();

  @ApiModelProperty(
      name = "Date after which the discount can no longer be used",
      example = "2021-08-31T19:40:10.000+00:00",
      required = false)
  @Column(name = "expires_at", nullable = true)
  private Date expiresAt;

  @ApiModelProperty(name = "Can the discount be used", example = "1")
  @Column(name = "is_enabled", columnDefinition = "boolean default true", nullable = false)
  private boolean isEnabled = true;

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

  public UUID getDiscountId() {
    return discountId;
  }

  public void setDiscountId(UUID discountId) {
    this.discountId = discountId;
  }

  public String getDiscountCode() {
    return discountCode;
  }

  public void setDiscountCode(String discountCode) {
    this.discountCode = discountCode;
  }

  public DiscountType getType() {
    return type;
  }

  public void setType(DiscountType type) {
    this.type = type;
  }

  public int getAmount() {
    return amount;
  }

  public void setAmount(int amount) {
    this.amount = amount;
  }

  public int getRemainingUses() {
    return remainingUses;
  }

  public void setRemainingUses(int remainingUses) {
    this.remainingUses = remainingUses;
  }

  public int getTotalUses() {
    return totalUses;
  }

  public void setTotalUses(int totalUses) {
    this.totalUses = totalUses;
  }

  public Date getStartsAt() {
    return startsAt;
  }

  public void setStartsAt(Date startsAt) {
    this.startsAt = startsAt;
  }

  public Date getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(Date expiresAt) {
    this.expiresAt = expiresAt;
  }

  public boolean getIsEnabled() {
    return isEnabled;
  }

  public void setIsEnabled(boolean isEnabled) {
    this.isEnabled = isEnabled;
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
    Discount discount = (Discount) o;
    return amount == discount.amount
        && remainingUses == discount.remainingUses
        && totalUses == discount.totalUses
        && isEnabled == discount.isEnabled
        && discountId.equals(discount.discountId)
        && discountCode.equals(discount.discountCode)
        && type == discount.type
        && Objects.equals(startsAt, discount.startsAt)
        && Objects.equals(expiresAt, discount.expiresAt)
        && Objects.equals(createdAt, discount.createdAt)
        && Objects.equals(updatedAt, discount.updatedAt);
  }

  @Override
  public int hashCode() {
    return Objects.hash(
        discountId,
        discountCode,
        type,
        amount,
        remainingUses,
        totalUses,
        startsAt,
        expiresAt,
        isEnabled,
        createdAt,
        updatedAt);
  }

  // TODO - OneToMany relationship to orders
}
