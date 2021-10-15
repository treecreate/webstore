package dk.treecreate.api.utils.model.quickpay;

public enum QuickpayStatusCode
{
    APPROVED(20000),
    WAITING_APPROVAL(20200),
    SECURE_IS_REQUIRED(30100),
    REJECTED_BY_ACQUIRER(40000),
    REQUEST_DATA_ERROR(40001),
    AUTHORIZATION_EXPIRED(40002),
    ABORTED(40003),
    GATEWAY_ERROR(50000),
    COMMUNICATIONS_ERROR_ACQUIRER(50300);

    public final int label;

    QuickpayStatusCode(int label)
    {
        this.label = label;
    }
}
