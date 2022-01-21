package dk.treecreate.api.shipmondo.shipment_object_components;

public class PrintAt {

    private String host_name;
    private String printer_name;
    private String label_format;

    /**
     * Empty class constructor
     */
    public PrintAt() { /* Empty class constructor */ }

    /**
     * 
     * @param host_name Name of the PC / host where the print client is installed.
     * @param printer_name Name of the printer that is registered within the print client.
     * @param label_format The label format that the printer can accept. <p>
     *  Allowed values: ["a4_pdf", "10x19_pdf", "png", "zpl"]
     */
    public PrintAt(String host_name, String printer_name, String label_format) {
        this.host_name = host_name;
        this.printer_name = printer_name;
        this.label_format = label_format;
    }

    // Getters and setters
    public String getHost_name() {
        return this.host_name;
    }

    public void setHost_name(String host_name) {
        this.host_name = host_name;
    }

    public String getPrinter_name() {
        return this.printer_name;
    }

    public void setPrinter_name(String printer_name) {
        this.printer_name = printer_name;
    }

    public String getLabel_format() {
        return this.label_format;
    }

    public void setLabel_format(String label_format) {
        this.label_format = label_format;
    }
}
