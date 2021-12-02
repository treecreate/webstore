import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IOrder, OrderStatusEnum } from '@interfaces';
import { OrdersService } from '../../services/orders/orders.service';
@Component({
  selector: 'webstore-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  isLoading = true;
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
  orderStatusOptions: OrderStatusEnum[] = [
    OrderStatusEnum.delivered,
    OrderStatusEnum.assembling,
    OrderStatusEnum.shipped,
    OrderStatusEnum.pending,
    OrderStatusEnum.initial,
    OrderStatusEnum.processed,
    OrderStatusEnum.new,
    OrderStatusEnum.rejected,
  ];
  orders!: IOrder[];

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  /**
   * Gets triggered when the status of an order has been changed.\
   * It will call the API to update the order with its new status.\
   * In case an error is encountered, the orders will be reloaded from the database.
   * 
   * @param order - the order containing the new status.
   */
  onStatusChange(order: IOrder): void {
    this.ordersService.updateOrder(order).subscribe({
      error: (error: HttpErrorResponse) => {
        this.fetchOrders();
        console.error(error);
      },
    });
  }

  /**
   * Fetches the orders from the API.\
   * \
   * Will toggle `isLoading` to `true` while the orders are being fetched
   * and revert it to `false` when they have been fetched.\
   * \
   * **Uses**: `ordersService` -> to call the API.
   */
  fetchOrders(): void {
    this.isLoading = true;
    this.ordersService.getOrders().subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      next: (orders: IOrder[]) => {
        this.isLoading = false;
        this.orders = orders;
      },
    });
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

enum LabelColorsEnum {
  red = '#FF0000',
  green = '#00B207',
  blue = '#6D7CFF',
  yellow = '#F4DC00',
  grey = '#ABABAB',
  lightGrey = '#F1F1F1',
}
