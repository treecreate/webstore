package dk.treecreate.api.utils;

import java.util.Random;
import org.springframework.stereotype.Service;

@Service
public class StringService {
  /**
   * Generates a random string of specified length
   *
   * @param length string length
   * @param includesSpecialChars should the generated string include special characters
   * @return a generated random string
   */
  public String generateRandomString(int length, boolean includesSpecialChars) {
    String alphanumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    String specialChars = "!@#$%&<>?";
    String randomChars =
        includesSpecialChars ? alphanumericChars + specialChars : alphanumericChars;
    StringBuilder randomString = new StringBuilder();
    Random random = new Random();
    for (int i = 0; i < length; i++) {
      int index = random.nextInt(randomChars.length());
      randomString.append(randomChars.charAt(index));
    }
    return randomString.toString();
  }
}
