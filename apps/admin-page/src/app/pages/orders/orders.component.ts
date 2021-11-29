import { Component } from '@angular/core';
import { IOrder, CurrencyEnum, ShippingMethodEnum, DiscountType, OrderStatusEnum } from '@interfaces';

@Component({
  selector: 'webstore-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent {
  isLoading = false;
  displayedColumns: string[] = [
    'paymentId',
    'paymentTotal',
    'contactEmail',
    'date',
    'daysLeft',
    'items',
    'status',
    'actions',
  ];

  orders: IOrder[] = [
    {
      status: OrderStatusEnum.pending,
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
      paymentId: 'c0a80121',
      plantedTrees: 1,
      shippingMethod: ShippingMethodEnum.homeDelivery,
      //State    -- not implemented
      subtotal: 1914,
      total: 1814,
      transactionItems: [],
      userID: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
    },
  ];

  /**
   * Calculates how many days there are left until the delivery date.
   *
   * @param orderDate The date when the order has been placed.
   * @returns amount of days left until delivery date.
   */
  getDaysLeft(orderDate: Date): number {
    // Calculate delivery date. (can take at most 14 days after the order was placed)
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 14);

    // Calculate how many days are left
    return Number(((deliveryDate.getTime() - Date.now()) / (1000 * 3600 * 24)).toFixed(0));
  }

  /**
   * Gets the Label color for the 'Days Left' column in the table based on the days left until
   * delivery and the status of the order.
   *
   * @param daysLeft days left until delivery.
   * @param orderStatus the status of the order.
   * @returns the color of the label.
   */
  getDaysLeftColor(daysLeft: number, orderStatus: OrderStatusEnum): LabelColorsEnum {
    // Order status is NOT: Delivered, Shipped or Rejected.
    if (
      orderStatus !== OrderStatusEnum.delivered &&
      orderStatus !== OrderStatusEnum.shipped &&
      orderStatus !== OrderStatusEnum.rejected
    ) {
      if (daysLeft >= 9) {
        return LabelColorsEnum.green;
      }
      if (daysLeft >= 5) {
        return LabelColorsEnum.yellow;
      }
      return LabelColorsEnum.red;
    }
    return LabelColorsEnum.lightGrey;
  }

  /**
   * Gets the Label color of the Order Status based on the status.
   * 
   * @param orderStatus the status of the order.
   * @returns the color of the label.
   */
  getOrderStatusColor(orderStatus: OrderStatusEnum): LabelColorsEnum {
    switch (orderStatus) {
      case OrderStatusEnum.initial:
        return LabelColorsEnum.blue;
      case OrderStatusEnum.pending:
        return LabelColorsEnum.blue;
      case OrderStatusEnum.new:
        return LabelColorsEnum.red;
      case OrderStatusEnum.rejected:
        return LabelColorsEnum.grey;
      case OrderStatusEnum.processed:
        return LabelColorsEnum.red;
      case OrderStatusEnum.assembling:
        return LabelColorsEnum.yellow;
      case OrderStatusEnum.shipped:
        return LabelColorsEnum.blue;
      case OrderStatusEnum.delivered:
        return LabelColorsEnum.green;
      default:
        return LabelColorsEnum.lightGrey;
    }
  }
}

enum LabelColorsEnum {
  red = '#FF0000',
  green = '#00B207',
  blue = '#6D7CFF',
  yellow = '#F4DC00',
  grey = '#ABABAB',
  lightGrey = '#F1F1F1',
}
