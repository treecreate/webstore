import { DiscountType, IBase } from '..';

export interface IDiscount extends IBase {
  discountId?: string;
  discountCode: string;
  type: DiscountType;
  amount: number;
  remainingUses: number;
  totalUses: number;
  expiresAt?: Date;
}
