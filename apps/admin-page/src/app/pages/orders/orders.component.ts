import { Component } from '@angular/core';
import { IOrder, CurrencyEnum, PaymentStateEnum, ShippingMethodEnum, DiscountType } from '@interfaces';

@Component({
  selector: 'webstore-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent {
  isLoading = false;
  displayedColumns: string[] = ['paymentId', 'paymentTotal', 'contactEmail', 'date', 'daysLeft', 'items', 'status'];
  orders: IOrder[] = [
    {
      paymentState: PaymentStateEnum.pending,
      state: PaymentStateEnum.pending,
      billingInfo: {
        city: 'cph',
        country: 'Denmark',
        email: 'example@hotdeals.dev',
        name: 'John Doe',
        phoneNumber: '+4512345678',
        postcode: '9999',
        streetAddress: 'StreetGade 123',
      },
      contactInfo: {
        city: 'cph',
        country: 'Denmark',
        email: 'example@hotdeals.dev',
        name: 'John Doe',
        phoneNumber: '+4512345678',
        postcode: '9999',
        streetAddress: 'StreetGade 123',
      },
      createdAt: new Date(),
      currency: CurrencyEnum.dkk,
      discount: {
        discountCode: 'suck it',
        type: DiscountType.amount,
        amount: 100,
        remainingUses: 1,
        totalUses: 2,
      },
      orderId: 'MakeMeWantIt',
      paymentId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
      plantedTrees: 1,
      shippingMethod: ShippingMethodEnum.homeDelivery,
      //State    -- not implemented
      subtotal: 1914,
      total: 1814,
      transactionItems: [],
      userID: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
    },
  ];

  actions: string[] = ['view'];
}
