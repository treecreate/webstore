package dk.treecreate.api.order.dto;

import io.swagger.annotations.ApiModelProperty;
import java.util.List;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public class CreateCustomOrderRequest {
  @NotBlank
  @Size(min = 1, max = 100)
  @ApiModelProperty(
      name = "The name of the custom request",
      required = true,
      example = "A plate to show an achievement")
  private String name;

  @NotBlank
  @Size(min = 1, max = 254)
  @Email
  @ApiModelProperty(name = "The email of the user", example = "user@example.com", required = true)
  private String email;

  @NotBlank
  @Size(min = 1, max = 1000)
  @ApiModelProperty(
      name = "The custom order decription",
      example = "The plate that displays an achievement like in the picture",
      required = true)
  private String description;

  @NotEmpty
  @ApiModelProperty(name = "Images of the custom request")
  private List<MultipartFile> images;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public List<MultipartFile> getImages() {
    return images;
  }

  public void setImages(List<MultipartFile> images) {
    this.images = images;
  }

  public String toJsonString() {
    // convert the MultipartFile information into a siplified JSON string
    StringBuilder imagesString = new StringBuilder();
    for (MultipartFile image : images) {
      String imageInfo =
          "{"
              + "\"name\": \""
              + image.getOriginalFilename()
              + "\""
              + ",\"size\": \""
              + image.getSize()
              + "\""
              + "},";
      imagesString.append(imageInfo);
    }
    // Remove the last ',' since it makes the JSON invalid
    imagesString.deleteCharAt(imagesString.length() - 1);
    // Return request JSON string
    return "{"
        + "\"name\": \""
        + name
        + "\""
        + ",\"email\": \""
        + email
        + "\""
        + ",\"description\": \""
        + description
        + "\""
        + ",\"images\": ["
        + imagesString
        + ']'
        + '}';
  }
}
