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
    public ServicePoint service_point;
    public PickupResponse pick_up;
    public BillToResponse bill_to;
    public boolean paperless_trade;
    public String labelless_code;
    public String source_id;
    public String source_type;
    public List<LabelResponse> labels;


    @Override
    public String toString() {
        return "{" +
            " id='" + id + "'" +
            ", created_at='" + created_at + "'" +
            ", updated_at='" + updated_at + "'" +
            ", carrier_code='" + carrier_code + "'" +
            ", description='" + description + "'" +
            ", contents='" + contents + "'" +
            ", product_id='" + product_id + "'" +
            ", services='" + services + "'" +
            ", product_code='" + product_code + "'" +
            ", service_codes='" + service_codes + "'" +
            ", price='" + price + "'" +
            ", reference='" + reference + "'" +
            ", order_id='" + order_id + "'" +
            ", pkg_no='" + pkg_no + "'" +
            ", receiver='" + receiver + "'" +
            ", sender='" + sender + "'" +
            ", parcels='" + parcels + "'" +
            ", service_point='" + service_point + "'" +
            ", pick_up='" + pick_up + "'" +
            ", bill_to='" + bill_to + "'" +
            ", paperless_trade='" + paperless_trade + "'" +
            ", labelless_code='" + labelless_code + "'" +
            ", source_id='" + source_id + "'" +
            ", source_type='" + source_type + "'" +
            ", labels='" + labels + "'" +
            "}";
    }


}
