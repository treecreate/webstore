package dk.treecreate.api.errorlog.dto;

import java.util.Map;
import java.util.UUID;

import javax.persistence.Convert;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import dk.treecreate.api.errorlog.ErrorPriority;
import dk.treecreate.api.utils.HashMapConverter;
import io.swagger.annotations.ApiModelProperty;

public class CreateErrorlogRequest {
  @NotBlank
  @Size(max = 100)
  @ApiModelProperty(example = "webstore.example.com", required = true)
  private String name;

  @NotNull
  @ApiModelProperty(
      notes = "userId associated with this event",
      example = "c0a80121-7ac0-190b-817a-c08ab0a12345",
      required = true)
  private UUID userId;

  @NotBlank
  @Size(max = 30)
  @ApiModelProperty(name = "Clients browser information", example = "Chrome 105", required = true)
  private String browser;

  @NotBlank
  @Size(max = 10000)
  @ApiModelProperty(name = "Page url", example = "https://treecreate.dk/login", required = true)
  private String url;

  @NotBlank
  @Size(max = 7)
  @ApiModelProperty(name = "Locale", example = "en-US", required = true)
  private String locale;

  @NotNull
  @ApiModelProperty(name = "Is the browser mobile", example = "true", required = true)
  private Boolean isMobile;

  @NotNull
  @ApiModelProperty(name = "Was the user logged in", example = "true", required = true)
  private Boolean isLoggedIn;

  @NotNull
  @ApiModelProperty(
      name = "Whether the client is running in production mode or not",
      example = "true",
      required = true)
  private Boolean production;

  @NotNull
  @ApiModelProperty(notes = "Error priority", example = "HIGH", required = true)
  private ErrorPriority priority;

  @ApiModelProperty(notes = "The actual error, as a JSON string", required = false)
  @Convert(converter = HashMapConverter.class)
  private Map<String, Object> error;

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
}
