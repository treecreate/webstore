import { Component, OnInit } from '@angular/core';
import { IOrder } from '@interfaces';

@Component({
  selector: 'webstore-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  isLoading = false;
  ordersList: IOrder[] = [];

  constructor() {}

  ngOnInit(): void {}
}
