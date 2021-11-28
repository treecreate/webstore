import { CurrencyEnum, IBase, IDiscount, ITransactionItem, OrderStatusEnum, ShippingMethodEnum } from '..';

export interface IOrder extends IBase {
  orderId: string;
  subtotal: number;
  total: number;
  currency: CurrencyEnum;
  plantedTrees: number;
  paymentId: string;
  userID: string;
  shippingMethod: ShippingMethodEnum;
  discount?: IDiscount;
  contactInfo: ContactInfo;
  billingInfo: ContactInfo;
  transactionItems: ITransactionItem[];
  createdAt: Date;
  status: OrderStatusEnum;
}

export interface ContactInfo {
  name: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  streetAddress2?: string;
  city: string;
  postcode: string;
  country: string;
}
