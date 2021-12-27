import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IOrder, OrderStatusEnum } from '@interfaces';
import { OrdersService } from '../../services/orders/orders.service';

enum LabelColorsEnum {
  red = '#FF0000',
  green = '#00B207',
  blue = '#6D7CFF',
  yellow = '#F4DC00',
  grey = '#ABABAB',
  lightGrey = '#F1F1F1',
}

@Component({
  selector: 'webstore-view-user-orders-dialog',
  templateUrl: './view-user-orders-dialog.component.html',
  styleUrls: ['./view-user-orders-dialog.component.css'],
})
export class ViewUserOrdersDialogComponent implements OnInit {
  isLoading = false;
  fullOrdersList?: IOrder[];
  orders: IOrder[] = [];

  displayedColumns: string[] = ['paymentId', 'paymentTotal', 'date', 'status', 'actions'];

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

  /**
   * @param ordersService
   * @param data
   * @param dialog
   * @param snackBar
   */
  constructor(
    private ordersService: OrdersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  /**
   * Fetch all orders through the api.
   */
  fetchOrders(): void {
    this.isLoading = true;
    this.ordersService.getOrders().subscribe(
      (listData: IOrder[]) => {
        this.fullOrdersList = listData;
        this.orders = this.fullOrdersList.filter((order) => order.userId === this.data.userId);
        if (this.orders.length === 0) {
          this.snackBar.open('User currently has no orders', 'Waaauw!', { duration: 4000 });
        }
        this.isLoading = false;
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
        this.snackBar.open('Failed to fetch orders', 'Doggo!', { duration: 4000 });
        this.isLoading = false;
      }
    );
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
