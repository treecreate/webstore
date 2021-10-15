// Holds all available mail templates
package dk.treecreate.api.mail;

public enum MailTemplate
{
    SIGNUP("signup"),
    RESET_PASSWORD("reset-password"),
    VERIFY_EMAIL("verify-email"),
    ORDER_CONFIRMATION("order-confirmation");

    public final String label;

    MailTemplate(String label)
    {
        this.label = label;
    }
}
