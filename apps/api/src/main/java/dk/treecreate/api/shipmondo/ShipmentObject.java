package dk.treecreate.api.shipmondo;

import java.util.List;

import dk.treecreate.api.shipmondo.shipment_object_components.BillTo;
import dk.treecreate.api.shipmondo.shipment_object_components.Cod;
import dk.treecreate.api.shipmondo.shipment_object_components.Customs;
import dk.treecreate.api.shipmondo.shipment_object_components.Dfm;
import dk.treecreate.api.shipmondo.shipment_object_components.PalletExchange;
import dk.treecreate.api.shipmondo.shipment_object_components.Parcels;
import dk.treecreate.api.shipmondo.shipment_object_components.PickUp;
import dk.treecreate.api.shipmondo.shipment_object_components.PrintAt;
import dk.treecreate.api.shipmondo.shipment_object_components.ReturnTo;
import dk.treecreate.api.shipmondo.shipment_object_components.SendLabel;
import dk.treecreate.api.shipmondo.shipment_object_components.ServicePoint;
import dk.treecreate.api.shipmondo.utility.Receiver;
import dk.treecreate.api.shipmondo.utility.Sender;

public class ShipmentObject {
    public boolean test_mode;
    public boolean own_agreement;      // Required
    public String customer_number;
    public String label_format = "a4_pdf";
    public String product_code;        // Required
    public String service_codes;       // Required
    public String reference;
    public boolean automatic_select_service_point;
    public Sender sender;              // Required
    public Receiver receiver;          // Required
    public PickUp pick_up;
    public BillTo bill_to;
    public ServicePoint service_point;
    public ReturnTo return_to;
    public List<Parcels> parcels;      // Required
    public boolean print;
    public PrintAt print_at;
    public SendLabel send_label;
    public PalletExchange pallet_exchange;
    public Customs customs;
    public boolean replace_http_status_code;
    public Cod cod;                    // Cash on Delivery
    public Dfm dfm;                    // Danske Fragtmænd extra info for them

    public ShipmentObject() { /* Blank constructor */ }
    

    /**
     * Class constructor with most likely to be used fields
     * @param test_mode Bool to enable or disable testing
     * @param sender Object with all the sender's information
     * @param receiver Object with all the receiver's information
     * @param parcels List of Parcels describing them
     * @param label Label object specifying where to send the shipping label to <p> 
     *              For now it's hardcoded to Teodor's email
     */
    public ShipmentObject(boolean test_mode, boolean isHomeDelivery, Sender sender, Receiver receiver, List<Parcels> parcels, SendLabel label) {
        this.test_mode = test_mode;
        this.own_agreement = false;
        this.label_format = "a4_pdf";
        this.automatic_select_service_point = !isHomeDelivery;
        this.product_code = isHomeDelivery ? "GLSDK_HD" : "GLSDK_SD"; // GLS home delivery or Store Delivery (pickup point)
        // TODO - Implement required phone number for home delivery requests
        this.service_codes = isHomeDelivery ? "EMAIL_NT,SMS_NT" : "EMAIL_NT"; // home delivery requires both sms and email notification
        this.sender = sender;
        this.receiver = receiver;
        this.parcels = parcels;
        this.send_label = label;
    }



    public boolean isTest_mode() {
        return this.test_mode;
    }

    public boolean getTest_mode() {
        return this.test_mode;
    }

    public void setTest_mode(boolean test_mode) {
        this.test_mode = test_mode;
    }

    public boolean isOwn_agreement() {
        return this.own_agreement;
    }

    public boolean getOwn_agreement() {
        return this.own_agreement;
    }

    public void setOwn_agreement(boolean own_agreement) {
        this.own_agreement = own_agreement;
    }

    public String getCustomer_number() {
        return this.customer_number;
    }

    public void setCustomer_number(String customer_number) {
        this.customer_number = customer_number;
    }

    public String getLabel_format() {
        return this.label_format;
    }

    public void setLabel_format(String label_format) {
        this.label_format = label_format;
    }

    public String getProduct_code() {
        return this.product_code;
    }

    public void setProduct_code(String product_code) {
        this.product_code = product_code;
    }

    public String getService_codes() {
        return this.service_codes;
    }

    public void setService_codes(String service_codes) {
        this.service_codes = service_codes;
    }

    public String getReference() {
        return this.reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public boolean getAutomatic_select_service_point() {
        return this.automatic_select_service_point;
    }

    public void setAutomatic_select_service_point(boolean automatic_select_service_point) {
        this.automatic_select_service_point = automatic_select_service_point;
    }

    public Sender getSender() {
        return this.sender;
    }

    public void setSender(Sender sender) {
        this.sender = sender;
    }

    public Receiver getReceiver() {
        return this.receiver;
    }

    public void setReceiver(Receiver receiver) {
        this.receiver = receiver;
    }

    public PickUp getPick_up() {
        return this.pick_up;
    }

    public void setPick_up(PickUp pick_up) {
        this.pick_up = pick_up;
    }

    public BillTo getBill_to() {
        return this.bill_to;
    }

    public void setBill_to(BillTo bill_to) {
        this.bill_to = bill_to;
    }

    public ServicePoint getService_point() {
        return this.service_point;
    }

    public void setService_point(ServicePoint service_point) {
        this.service_point = service_point;
    }

    public ReturnTo getReturn_to() {
        return this.return_to;
    }

    public void setReturn_to(ReturnTo return_to) {
        this.return_to = return_to;
    }

    public List<Parcels> getParcels() {
        return this.parcels;
    }

    public void setParcels(List<Parcels> parcels) {
        this.parcels = parcels;
    }

    public boolean isPrint() {
        return this.print;
    }

    public boolean getPrint() {
        return this.print;
    }

    public void setPrint(boolean print) {
        this.print = print;
    }

    public PrintAt getPrint_at() {
        return this.print_at;
    }

    public void setPrint_at(PrintAt print_at) {
        this.print_at = print_at;
    }

    public SendLabel getSend_label() {
        return this.send_label;
    }

    public void setSend_label(SendLabel send_label) {
        this.send_label = send_label;
    }

    public PalletExchange getPallet_exchange() {
        return this.pallet_exchange;
    }

    public void setPallet_exchange(PalletExchange pallet_exchange) {
        this.pallet_exchange = pallet_exchange;
    }

    public Customs getCustoms() {
        return this.customs;
    }

    public void setCustoms(Customs customs) {
        this.customs = customs;
    }

    public boolean isReplace_http_status_code() {
        return this.replace_http_status_code;
    }

    public boolean getReplace_http_status_code() {
        return this.replace_http_status_code;
    }

    public void setReplace_http_status_code(boolean replace_http_status_code) {
        this.replace_http_status_code = replace_http_status_code;
    }

    public Cod getCod() {
        return this.cod;
    }

    public void setCod(Cod cod) {
        this.cod = cod;
    }

    public Dfm getDfm() {
        return this.dfm;
    }

    public void setDfm(Dfm dfm) {
        this.dfm = dfm;
    }

    @Override
    public String toString() {
        return "{" +
            " test_mode='" + isTest_mode() + "'" +
            ", own_agreement='" + isOwn_agreement() + "'" +
            ", customer_number='" + getCustomer_number() + "'" +
            ", label_format='" + getLabel_format() + "'" +
            ", product_code='" + getProduct_code() + "'" +
            ", service_codes='" + getService_codes() + "'" +
            ", reference='" + getReference() + "'" +
            ", automatic_select_service_point='" + getAutomatic_select_service_point() + "'" +
            ", sender='" + getSender() + "'" +
            ", receiver='" + getReceiver() + "'" +
            ", pick_up='" + getPick_up() + "'" +
            ", bill_to='" + getBill_to() + "'" +
            ", service_point='" + getService_point() + "'" +
            ", return_to='" + getReturn_to() + "'" +
            ", parcels='" + getParcels() + "'" +
            ", print='" + isPrint() + "'" +
            ", print_at='" + getPrint_at() + "'" +
            ", send_label='" + getSend_label() + "'" +
            ", pallet_exchange='" + getPallet_exchange() + "'" +
            ", customs='" + getCustoms() + "'" +
            ", replace_http_status_code='" + isReplace_http_status_code() + "'" +
            ", cod='" + getCod() + "'" +
            ", dfm='" + getDfm() + "'" +
            "}";
    }
    

}
