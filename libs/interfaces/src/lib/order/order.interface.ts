import { IDiscount } from '../pricing';
import { ITransactionItem } from '../transaction-item/transaction-item.interface';
import { CurrencyEnum } from './currency.enum';
import { PaymentStateEnum } from './payment-state.enum';
import { ShippingMethodEnum } from './shipping-method.enum';

export interface IOrder {
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
