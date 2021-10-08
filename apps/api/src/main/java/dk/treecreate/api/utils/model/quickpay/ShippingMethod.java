package dk.treecreate.api.utils.model.quickpay;

/**
 * Shipping options available in Quickpay that we may use
 */
public enum ShippingMethod
{
    HOME_DELIVERY("home_delivery"),
    PICK_UP_POINT("pick_up_point"),
    OWN_DELIVERY("own_delivery"); // used for international shipping

    public final String label;

    ShippingMethod(String label)
    {
        this.label = label;
    }

}
