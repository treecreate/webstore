import { DiscountType } from '@interfaces';

export interface IDiscount {
  discountId?: string;
  discountCode: string;
  type: DiscountType;
  amount: number;
  remainingUses: number;
  totalUses: number;
  expiresAt?: Date;
}
