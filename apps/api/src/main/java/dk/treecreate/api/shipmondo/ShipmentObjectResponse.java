package dk.treecreate.api.shipmondo;

import java.util.List;

import dk.treecreate.api.shipmondo.shipment_object_components.ServicePoint;
import dk.treecreate.api.shipmondo.shipment_object_response_components.BillToResponse;
import dk.treecreate.api.shipmondo.shipment_object_response_components.LabelResponse;
import dk.treecreate.api.shipmondo.shipment_object_response_components.ParcelsResponse;
import dk.treecreate.api.shipmondo.shipment_object_response_components.PickupResponse;
import dk.treecreate.api.shipmondo.utility.Receiver;
import dk.treecreate.api.shipmondo.utility.Sender;

public class ShipmentObjectResponse {
    public int id;
    public String created_at;
    public String updated_at;
    public String carrier_code;
    public String description;
    public String contents;
    public int product_id;
    public String services;
    public String product_code;
    public String service_codes;
    public double price;
    public String reference;
    public String order_id;
    public String pkg_no;
    public Receiver receiver;
    public Sender sender;
    public List<ParcelsResponse> parcels;
    public ServicePoint servicePoint;
    public PickupResponse pickUp;
    public BillToResponse billTo;
    public boolean paperless_trade;
    public String labelless_code;
    public String source_id;
    public String source_type;
    public List<LabelResponse> labels;
    

    
}
