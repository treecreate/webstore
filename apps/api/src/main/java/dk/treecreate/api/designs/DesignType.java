package dk.treecreate.api.designs;

public enum DesignType
{
    // if the order of these ever gets changed, the saved designs have to be updated since the entry uses the enum index (0 = family tree etc)
    // If you don't update the saved designs, they will be returning a wrong (old) design type index
    FAMILY_TREE("FAMILY_TREE");

    public final String label;

    DesignType(String label)
    {
        this.label = label;
    }
}
