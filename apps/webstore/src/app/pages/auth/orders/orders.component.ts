import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IOrder } from '@interfaces';
import { OrderService } from '../../../shared/services/order/order.service';

@Component({
  selector: 'webstore-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  isLoading = false;
  orderCollection: IOrder[] = [];

  constructor(private orderService: OrderService) {}

  getOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders().subscribe(
      (orderCollection: IOrder[]) => {
        this.orderCollection = orderCollection;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  ngOnInit(): void {
    this.getOrders();
  }
}
