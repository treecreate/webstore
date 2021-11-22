import {
  CurrencyEnum,
  IBase,
  ITransactionItem,
  PaymentStateEnum,
  ShippingMethodEnum,
} from '..';
import { IDiscount } from '../pricing';

export interface IOrder extends IBase {
  orderId: string;
  subtotal: number;
  total: number;
  currency: CurrencyEnum;
  paymentState: PaymentStateEnum;
  plantedTrees: number;
  paymentId: string;
  userID: string;
  shippingMethod: ShippingMethodEnum;
  discount?: IDiscount;
  contactInfo: ContactInfo;
  billingInfo: ContactInfo;
  transactionItems: ITransactionItem[];
  createdAt: Date;
  state?: PaymentStateEnum;
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
