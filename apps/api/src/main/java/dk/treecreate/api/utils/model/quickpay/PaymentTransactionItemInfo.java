package dk.treecreate.api.utils.model.quickpay;

import dk.treecreate.api.designs.DesignDimension;
import dk.treecreate.api.designs.DesignType;
import java.util.UUID;

/**
 * Represents transaction info stored as part of the Payment model in quickpay (in variables
 * property)
 */
public class PaymentTransactionItemInfo {
  public UUID designId;
  public DesignType designType;
  public int quantity;
  public DesignDimension dimension;
}
