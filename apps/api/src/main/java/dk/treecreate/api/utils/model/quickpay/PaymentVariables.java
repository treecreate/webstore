package dk.treecreate.api.utils.model.quickpay;

import java.util.List;
import java.util.UUID;

/**
 * Properties of the payment: variables field. Used to include more information in the payment
 * object in Quickpay
 */
public class PaymentVariables {
  public UUID orderId;
  public UUID userId;
  public UUID discountId;
  public int plantedTrees;
  public List<PaymentTransactionItemInfo> items;

  @Override
  public String toString() {
    return "PaymentVariables{"
        + "orderId="
        + orderId
        + ", userId="
        + userId
        + ", discountId="
        + discountId
        + ", plantedTrees="
        + plantedTrees
        + '}';
  }
}
