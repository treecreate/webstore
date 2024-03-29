package dk.treecreate.api.designs;

import dk.treecreate.api.user.User;
import dk.treecreate.api.utils.HashMapConverter;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import javax.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "designs")
public class Design {

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
  @Column(name = "design_id", updatable = false, nullable = false)
  @ApiModelProperty(
      notes = "UUID of the design entity",
      example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
  private UUID designId;

  @ManyToOne
  @ApiModelProperty(notes = "The user the design belongs to")
  private User user;

  @Column(name = "design_properties", nullable = false, columnDefinition = "longtext")
  @ApiModelProperty(
      notes = "Design-specific properties, as a JSON string",
      example =
          "{ font: 'Roboto',"
              + "  design: 'first',"
              + "  boxSize: 10,"
              + "  banner: false,"
              + "  boxes: []}")
  @Convert(converter = HashMapConverter.class)
  private Map<String, Object> designProperties;

  @Column(name = "design_type", nullable = false)
  @ApiModelProperty(notes = "Design type", example = "FAMILY_TREE")
  private DesignType designType;

  @Column(name = "mutable", columnDefinition = "boolean default true", nullable = false)
  @ApiModelProperty(notes = "Can the design be changed", example = "true", required = true)
  private boolean mutable = true;

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

  public Design() {}

  public UUID getDesignId() {
    return designId;
  }

  public void setDesignId(UUID designId) {
    this.designId = designId;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Map<String, Object> getDesignProperties() {
    return designProperties;
  }

  public void setDesignProperties(Map<String, Object> designProperties) {
    this.designProperties = designProperties;
  }

  public DesignType getDesignType() {
    return designType;
  }

  public void setDesignType(DesignType designType) {
    this.designType = designType;
  }

  public boolean isMutable() {
    return mutable;
  }

  public void setMutable(boolean mutable) {
    this.mutable = mutable;
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
    Design design = (Design) o;
    return mutable == design.mutable
        && designId.equals(design.designId)
        && Objects.equals(user, design.user)
        && designProperties.equals(design.designProperties)
        && designType == design.designType;
  }

  @Override
  public int hashCode() {
    return Objects.hash(designId, user, designProperties, designType, mutable);
  }
}
