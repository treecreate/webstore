package dk.treecreate.api.errorlog;

public enum ErrorPriority

{
    LOW("low"),
    MEDIUM("medium"),
    HIGH("high"),
    CRITICAL("critical");

    public final String label;

    ErrorPriority(String label)
    {
        this.label = label;
    }
}
