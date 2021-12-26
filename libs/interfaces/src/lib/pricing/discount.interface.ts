import { DiscountType, IBase } from '..';

export interface IDiscount extends IBase {
  discountId?: string;
  discountCode: string;
  type: DiscountType;
  amount: number;
  remainingUses: number;
  totalUses: number;
  isEnabled: boolean;
  startsAt?: Date;
  expiresAt?: Date;
}
