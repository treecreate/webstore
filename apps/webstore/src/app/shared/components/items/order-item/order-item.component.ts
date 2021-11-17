import { Component, Input, OnInit } from '@angular/core';
import { IOrder, ITransactionItem } from '@interfaces';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';

@Component({
  selector: 'webstore-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css'],
})
export class OrderItemComponent implements OnInit {
  @Input() order: IOrder;
  @Input() orderNumber: number;
  isLoading = false;

  constructor(private calculePriceService: CalculatePriceService) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  getPrice(transactionItem: ITransactionItem): number {
    return this.calculePriceService.calculateItemPrice(transactionItem);
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
