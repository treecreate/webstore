package dk.treecreate.api.errorlog;

import dk.treecreate.api.utils.HashMapConverter;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "errorlogs")
public class Errorlog {
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
  @Column(name = "errorlog_id", updatable = false, nullable = false)
  @ApiModelProperty(
      notes = "UUID of the errorlog entity",
      example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
  private UUID errorlogId;

  @NotBlank
  @Size(max = 100)
  @ApiModelProperty(
      name = "The name of the errorlog",
      example = "webstore.login.login-failed",
      required = true)
  private String name;

  // The userId is not a relation because 1. JPA sucks, and 2. Doesn't need to be
  @Type(type = "uuid-char")
  @Column(name = "user_id", nullable = false)
  @ApiModelProperty(
      notes =
          "Id of the errorlogs's user. Doesn't correspond to database user if it was made when not logged in",
      example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
  private UUID userId;

  @NotBlank
  @Size(max = 30)
  @ApiModelProperty(name = "Clients browser information", example = "Chrome 105", required = true)
  private String browser;

  @NotBlank
  @Column(columnDefinition = "TEXT")
  @ApiModelProperty(name = "Page url", example = "https://treecreate.dk/login", required = true)
  private String url;

  @Size(max = 7)
  @ApiModelProperty(name = "Locale", example = "en-US", required = true)
  @Column(columnDefinition = "varchar(7) default 'N/A'")
  private String locale = "N/A";

  @ApiModelProperty(name = "Is the browser mobile", example = "true", required = true)
  @Column(columnDefinition = "boolean default null")
  private Boolean isMobile = null;

  @ApiModelProperty(name = "Was the user logged in", example = "true", required = true)
  @Column(columnDefinition = "boolean default null")
  private Boolean isLoggedIn = null;

  @NotNull
  @ApiModelProperty(
      name = "Whether the client is running in production mode or not",
      example = "true",
      required = true)
  private Boolean production;

  @NotNull
  @ApiModelProperty(
      name = "Whether the error has been resolved by the developers",
      example = "false",
      required = true)
  private Boolean resolved = false;

  @NotNull
  @Column(name = "priority", nullable = false)
  @ApiModelProperty(notes = "Error priority", example = "HIGH", required = true)
  private ErrorPriority priority = ErrorPriority.MEDIUM;

  @Column(name = "error", nullable = true, columnDefinition = "longtext")
  @ApiModelProperty(notes = "The actual error, as a JSON string", required = false)
  @Convert(converter = HashMapConverter.class)
  private Map<String, Object> error;

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

  public UUID getErrorlogId() {
    return errorlogId;
  }

  public void setErrorlogId(UUID errorlogId) {
    this.errorlogId = errorlogId;
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

  public String getBrowser() {
    return browser;
  }

  public void setBrowser(String browser) {
    this.browser = browser;
  }

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
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

  public Boolean getProduction() {
    return production;
  }

  public void setProduction(Boolean production) {
    this.production = production;
  }

  public Boolean getResolved() {
    return resolved;
  }

  public void setResolved(Boolean resolved) {
    this.resolved = resolved;
  }

  public ErrorPriority getPriority() {
    return priority;
  }

  public void setPriority(ErrorPriority priority) {
    this.priority = priority;
  }

  public Map<String, Object> getError() {
    return error;
  }

  public void setError(Map<String, Object> error) {
    this.error = error;
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
    Errorlog errorlog = (Errorlog) o;
    return errorlogId.equals(errorlog.errorlogId)
        && name.equals(errorlog.name)
        && Objects.equals(userId, errorlog.userId)
        && Objects.equals(browser, errorlog.browser)
        && Objects.equals(url, errorlog.url)
        && Objects.equals(production, errorlog.production)
        && Objects.equals(createdAt, errorlog.createdAt)
        && Objects.equals(updatedAt, errorlog.updatedAt);
  }

  @Override
  public int hashCode() {
    return Objects.hash(errorlogId, name, userId, browser, url, production, createdAt, updatedAt);
  }
}
