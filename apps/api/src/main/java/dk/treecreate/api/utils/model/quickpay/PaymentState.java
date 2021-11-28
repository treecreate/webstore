package dk.treecreate.api.utils.model.quickpay;

/**
 * Payment status in Quickpay
 */
public enum PaymentState
{
    INITIAL("initial"),
    PENDING("pending"),
    NEW("new"),
    REJECTED("rejected"),
    PROCESSED("processed");

    public final String label;

    PaymentState(String label)
    {
        this.label = label;
    }
}
