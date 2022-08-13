package dk.treecreate.api.authentication;

import io.swagger.annotations.Api;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("auth/test")
@Api(tags = {"Authentication"})
public class AuthTestController {
  @GetMapping("/all")
  @Operation(summary = "Test that anyone can access this content")
  public String allAccess() {
    return "Public Content.";
  }

  @GetMapping("/user")
  @Operation(summary = "Test that only authenticated users can access this content")
  @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER') or hasRole('ADMIN')")
  public String userAccess() {
    return "User Content.";
  }

  @GetMapping("/developer")
  @Operation(
      summary =
          "Test that only authenticated users with Admin or Developer permissions can access this content")
  @PreAuthorize("hasRole('DEVELOPER')")
  public String moderatorAccess() {
    return "Developer Board.";
  }

  @GetMapping("/admin")
  @Operation(
      summary = "Test that only authenticated users with Admin permissions can access this content")
  @PreAuthorize("hasRole('ADMIN')")
  public String adminAccess() {
    return "Admin Board.";
  }
}
