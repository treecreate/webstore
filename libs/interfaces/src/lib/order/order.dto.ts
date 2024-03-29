import { ContactInfo, CurrencyEnum, OrderStatusEnum, ShippingMethodEnum } from '.';

export interface CreateOrderRequest {
  subtotal: number;
  total: number;
  currency?: CurrencyEnum;
  status?: OrderStatusEnum;
  plantedTrees: number;
  shippingMethod: ShippingMethodEnum;
  discountId: string;
  contactInfo: CreateContactInfoRequest;
  billingInfo: CreateContactInfoRequest;
  transactionItemIds: string[];
}

export interface CreateCustomOrderRequest {
  name: string;
  email: string;
  description: string;
  files: File[];
}

export interface CreateContactInfoRequest {
  name: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  streetAddress2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface CreateUpdateOrderRequest {
  contactInfo?: ContactInfo;
  status: OrderStatusEnum;
}
