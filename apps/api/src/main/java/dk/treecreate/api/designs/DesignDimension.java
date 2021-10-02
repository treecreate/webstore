package dk.treecreate.api.designs;

public enum DesignDimension
{
    // if the order of these ever gets changed, the saved transaction items have to be updated since the entry uses the enum index (0 = family tree etc)
    // If you don't update the saved designs, they will be returning a wrong (old) design dimensions index
    SMALL,
    MEDIUM,
    BIG,
    ONE_SIZE;
}
