package dk.treecreate.api.order;

public enum Currency
{
    DKK("dkk");

    public final String label;

    Currency(String label)
    {
        this.label = label;
    }
}
