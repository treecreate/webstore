import { Component, Input, OnInit } from '@angular/core';
import { IDesign } from '@interfaces';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';

@Component({
  selector: 'webstore-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.css'],
})
export class CheckoutItemComponent implements OnInit {
  @Input() item: IDesign;

  itemPrice: number;
  itemUnitPrice: number;

  constructor(private calculatePriceService: CalculatePriceService) {}

  ngOnInit(): void {
    this.itemUnitPrice = this.calculatePriceService.calculateItemUnitPrice(
      this.item.size
    );
    this.itemPrice = this.calculatePriceService.calculateItemPrice(this.item);
  }
}
