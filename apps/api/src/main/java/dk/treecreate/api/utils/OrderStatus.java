package dk.treecreate.api.utils;

public enum OrderStatus
{
    INITIAL("payment initialized"),
    PENDING("payment pending"),
    NEW("payment received"),
    REJECTED("payment rejected"),
    PROCESSED("payment processed"),
    ASSEMBLING("assembling"),
    SHIPPED("shipped"),
    DELIVERED("delivered");

    public final String label;

    OrderStatus(String label)
    {
        this.label = label;
    }
}
