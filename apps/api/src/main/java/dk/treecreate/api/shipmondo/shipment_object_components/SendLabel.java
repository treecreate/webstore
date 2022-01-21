package dk.treecreate.api.shipmondo.shipment_object_components;

public class SendLabel {
    private String name ;
    private String email ;
    private String label_format ;

    /**
     * Blank class constructor
     */
    public SendLabel() { /* Blank class constructor */ }

    /**
     * Class constructor with all possible fields
     * @param name Name of the recipient of the label.
     * @param email Email address of the recipient of the label, which the label should be sent to.
     * @param label_format The label format that should be attached to the email. <p>
     *  Allowed values (possibly): ["a4_pdf", "10x19_pdf", "png", "zpl"]
     */
    public SendLabel(String name, String email, String label_format) {
        this.name = name;
        this.email = email;
        this.label_format = label_format;
    }


    // Getters and setters
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLabel_format() {
        return this.label_format;
    }

    public void setLabel_format(String label_format) {
        this.label_format = label_format;
    }


    @Override
    public String toString() {
        return "{" +
            " name='" + getName() + "'" +
            ", email='" + getEmail() + "'" +
            ", label_format='" + getLabel_format() + "'" +
            "}";
    }
}
