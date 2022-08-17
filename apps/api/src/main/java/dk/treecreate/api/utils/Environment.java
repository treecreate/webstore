package dk.treecreate.api.utils;

// represents the environments the API can be running in
public enum Environment {
  DEVELOPMENT("development"),
  STAGING("staging"),
  PRODUCTION("production");

  public final String label;

  Environment(String label) {
    this.label = label;
  }
}
