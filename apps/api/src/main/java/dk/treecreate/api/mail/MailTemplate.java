// Holds all available mail templates
package dk.treecreate.api.mail;

public enum MailTemplate
{
    SIGNUP("signup"),
    SIGNUP_ON_ORDER("signup-on-order"),
    RESET_PASSWORD("reset-password"),
    VERIFY_EMAIL("verify-email"),
    ORDER_CONFIRMATION("order-confirmation"),
    NEWSLETTER_DISCOUNT("newsletter-discount");

    public final String label;

    MailTemplate(String label)
    {
        this.label = label;
    }
}
