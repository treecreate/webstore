import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUpdateOrderRequest, IOrder, OrderStatusEnum } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  /**
   * Calls the API to fetch all available orders.
   *
   * @returns an observable with the list of orders.
   */
  public getOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${env.apiUrl}/orders`);
  }

  /**
   * Calls the API to fetch all available orders.
   *
   * @returns an observable with the list of orders.
   */
  //  public getOrdersById(userId: string): Observable<IOrder[]> {
  //   return this.http.get<IOrder[]>(`${env.apiUrl}/orders/${userId}`);
  // }

  /**
   * Calls the API to update the status of an order.
   *
   * @param order - the order that needs to be updated.
   * @returns an observable with the updated order.
   */
  public updateOrder(params: CreateUpdateOrderRequest, orderId: string): Observable<IOrder> {
    return this.http.patch<IOrder>(`${env.apiUrl}/orders/${orderId}`, params);
  }

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

export enum LabelColorsEnum {
  red = '#FF0000',
  green = '#00B207',
  blue = '#6D7CFF',
  yellow = '#F4DC00',
  grey = '#ABABAB',
  lightGrey = '#F1F1F1',
}
