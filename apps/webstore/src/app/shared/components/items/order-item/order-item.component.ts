import { Component, Input, OnInit } from '@angular/core';
import { IOrder } from '@interfaces';

@Component({
  selector: 'webstore-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css'],
})
export class OrderItemComponent implements OnInit {
  @Input() order: IOrder;
  isLoading = false;

  constructor() {}

  ngOnInit(): void {}
}
