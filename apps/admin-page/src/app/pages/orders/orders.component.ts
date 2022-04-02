import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IOrder, OrderStatusEnum, ItemInfo } from '@interfaces';
import { OrdersService } from '../../services/orders/orders.service';
import { Sort } from '@angular/material/sort';

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
  pendingOrders: number = 0;

  ordersTopInfo: ItemInfo[] = [
    {
      description: 'Pending',
      amount: this.pendingOrders,
    },
  ];

  constructor(public ordersService: OrdersService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  /**
   * Gets triggered when the status of an order has been changed.\
   * It will call the API to update the order with its new status.\
   * In case an error is encountered, the orders will be reloaded from the database.
   *
   * @param orderStatus
   * @param orderId
   */
  onStatusChange(orderStatus: OrderStatusEnum, orderId: string): void {
    this.ordersService
      .updateOrder(
        {
          status: orderStatus,
        },
        orderId
      )
      .subscribe({
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
        this.pendingOrders = orders.filter(
          (order) =>
            order.status === OrderStatusEnum.pending ||
            order.status === OrderStatusEnum.new ||
            order.status === OrderStatusEnum.initial
        ).length;
        this.ordersTopInfo = [
          {
            description: 'Pending',
            amount: this.pendingOrders,
            color: 'green',
          },
          {
            description: 'Total Orders',
            amount: orders.length,
          },
        ];
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
   * Sorts the data of the table.
   *
   * @param sort
   */
  sortData(sort: Sort) {
    const data = this.orders.slice();
    if (!sort.active || sort.direction === '') {
      this.orders = data;
      return;
    }

    this.orders = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'paymentId':
          return compare(a.paymentId, b.paymentId, isAsc);
        case 'paymentTotal':
          return compare(a.total, b.total, isAsc);
        case 'contactEmail':
          return compare(a.contactInfo.email, b.contactInfo.email, isAsc);
        case 'date':
          return compare(a.createdAt, b.createdAt, isAsc);
        case 'daysLeft':
          return compare(this.getDaysLeft(a.createdAt), this.getDaysLeft(b.createdAt), isAsc);
        case 'items':
          return compare(a.transactionItems.length, b.transactionItems.length, isAsc);
        case 'status':
          return compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
  }
}

/**
 * Compares two elements.
 *
 * @param a element a.
 * @param b element b.
 * @param isAsc is sorted ascended.
 * @returns the result of the comparison.
 */
function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

enum LabelColorsEnum {
  red = '#FF0000',
  green = '#00B207',
  blue = '#6D7CFF',
  yellow = '#F4DC00',
  grey = '#ABABAB',
  lightGrey = '#F1F1F1',
  emp_color = '#6D7CFF',
  turquoise = '#00DFED',
}
