package dk.treecreate.api.discount;

public enum DiscountType {
  // if the order of these ever gets changed, the saved discounts have to be updated since the entry
  // uses the enum index (0 = amount etc)
  // If you don't update the saved discounts, they will be returning a wrong (old) discount type
  // index
  AMOUNT,
  PERCENT
}
