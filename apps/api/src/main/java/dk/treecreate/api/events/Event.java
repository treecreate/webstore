package dk.treecreate.api.events;

import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "events")
public class Event {
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
  @Column(name = "event_id", updatable = false, nullable = false)
  @ApiModelProperty(
      notes = "UUID of the event entity",
      example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
  private UUID eventId;

  @NotBlank
  @Size(max = 80)
  @ApiModelProperty(
      name = "The name of the event",
      example = "webstore.cookies-accepted",
      required = true)
  private String name;

  // The userId is not a relation because 1. JPA sucks, and 2. Doesn't need to be
  @Type(type = "uuid-char")
  @Column(name = "user_id", nullable = false)
  @ApiModelProperty(
      notes =
          "Id of the events's user. Doesn't correspond to database user if it was made when not logged in",
      example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
  private UUID userId;

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

  public UUID getEventId() {
    return eventId;
  }

  public void setEventId(UUID eventId) {
    this.eventId = eventId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
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
    Event event = (Event) o;
    return eventId.equals(event.eventId) && name.equals(event.name) && userId.equals(event.userId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(eventId, name, userId);
  }
}
