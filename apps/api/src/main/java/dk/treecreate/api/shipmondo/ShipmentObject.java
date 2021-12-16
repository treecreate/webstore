package dk.treecreate.api.shipmondo;

import dk.treecreate.api.shipmondo.utility.Receiver;
import dk.treecreate.api.shipmondo.utility.Sender;

public class ShipmentObject {
    private boolean test_mode;
    private boolean own_agreement;      // Required
    private String customer_number;
    private String label_format;
    private String product_code;        // Required
    private String service_codes;       // Required
    private String reference;
    private String automatic_select_service_point;
    private Sender sender;
    private Receiver receiver;
    private PickUp pick_up;
    private BillTo bill_to;
    private ServicePoint service_point;
    private ReturnTo return_to;
    // private Parcels[] parcels;
    private boolean print;
    // private PrintAt print_at;
    // private SendLabel send_label;
    // private PalletExchange pallet_exchange;
    // private Customs customs;
    private boolean replace_http_status_code;
    // private Cod cod;                    // Cash on Delivery
    // private Dmf dmf;                    // Danske Fragtmænd extra info for them


}
