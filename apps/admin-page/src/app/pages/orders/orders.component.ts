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

  constructor(public ordersService: OrdersService) {}

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
}
