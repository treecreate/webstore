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
  @Size(max = 100)
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

  @Size(max = 100)
  @ApiModelProperty(
      name = "The URL event happened on",
      example = "https://treecreate.dk/products",
      required = true)
  @Column(columnDefinition = "varchar(100) default 'N/A'")
  private String url;

  @Size(max = 30)
  @ApiModelProperty(name = "Clients browser information", example = "Chrome 105", required = true)
  @Column(columnDefinition = "varchar(30) default 'N/A'")
  private String browser;

  @Size(max = 7)
  @ApiModelProperty(name = "Locale", example = "en-US", required = true)
  @Column(columnDefinition = "varchar(7) default 'N/A'")
  private String locale;

  @ApiModelProperty(name = "Is the browser mobile", example = "true", required = true)
  @Column(columnDefinition = "boolean default null")
  private Boolean isMobile;

  @ApiModelProperty(name = "Was the user logged in", example = "true", required = true)
  @Column(columnDefinition = "boolean default null")
  private Boolean isLoggedIn;

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

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  public String getBrowser() {
    return browser;
  }

  public void setBrowser(String browser) {
    this.browser = browser;
  }

  public String getLocale() {
    return locale;
  }

  public void setLocale(String locale) {
    this.locale = locale;
  }

  public Boolean getIsMobile() {
    return isMobile;
  }

  public void setIsMobile(Boolean isMobile) {
    this.isMobile = isMobile;
  }

  public Boolean getIsLoggedIn() {
    return isLoggedIn;
  }

  public void setIsLoggedIn(Boolean isLoggedIn) {
    this.isLoggedIn = isLoggedIn;
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
