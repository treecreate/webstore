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

export interface CreateDiscountRequest {
  discountCode: string;
  expiresAt: Date;
  startsAt: Date;
  isEnabled: boolean;
  totalUses: number;
  mount: number;
  type: DiscountType;
}
