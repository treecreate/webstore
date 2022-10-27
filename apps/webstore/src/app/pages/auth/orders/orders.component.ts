import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ErrorlogPriorityEnum, IOrder } from '@interfaces';
import { ErrorlogsService } from '../../../shared/services/errorlog/errorlog.service';
import { EventsService } from '../../../shared/services/events/events.service';
import { OrderService } from '../../../shared/services/order/order.service';

@Component({
  selector: 'webstore-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  isLoading = false;
  orderCollection: IOrder[] = [];

  constructor(
    private orderService: OrderService,
    public eventsService: EventsService,
    private errorlogsService: ErrorlogsService
  ) {}

  getOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (orderCollection: IOrder[]) => {
        this.orderCollection = orderCollection;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error.error);
        this.errorlogsService.create('webstore.orders.orders-load-failed', ErrorlogPriorityEnum.medium, error);
      },
    });
  }

  ngOnInit(): void {
    this.getOrders();
  }
}
