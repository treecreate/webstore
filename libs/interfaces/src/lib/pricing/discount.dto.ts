import { DiscountType } from '.';

export interface UpdateDiscountRequest {
  discountCode?: string;
  type?: DiscountType;
  amount?: number;
  remainingUses?: number;
  totalUses?: number;
  isEnabled?: boolean;
  startsAt?: Date;
  expiresAt?: Date;
}
