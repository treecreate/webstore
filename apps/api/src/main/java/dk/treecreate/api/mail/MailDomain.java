// Holds all available mail domains Treecreate owns
package dk.treecreate.api.mail;

public enum MailDomain
{
  INFO("info@treecreate.dk"),
  ORDER("orders@treecreate.dk");

  public final String label;

  MailDomain(String label)
  {
    this.label = label;
  }
}
