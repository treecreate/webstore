import { IDiscount } from '../pricing';

export interface IOrder {
  orderId: string;
  purchaseStatus: string;
  discountCode: IDiscount;
  initialPrice: number;
  finalPrice: number;
  currency: string;
  createdAt: string;
}
