import { Component, Input, OnInit } from '@angular/core';
import { DesignDimensionEnum, IDesign, ITransactionItem } from '@interfaces';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';

@Component({
  selector: 'webstore-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.css'],
})
export class CheckoutItemComponent implements OnInit {
  @Input() item: ITransactionItem;

  itemPrice: number;
  itemUnitPrice: number;

  constructor(private calculatePriceService: CalculatePriceService) {}

  ngOnInit(): void {
    this.itemUnitPrice = this.calculatePriceService.calculateItemUnitPrice(
      this.item.dimension
    );
    this.itemPrice = this.calculatePriceService.calculateItemPrice(this.item);
  }

  sizeInCm(dimension: string): string {
    switch (dimension) {
      case DesignDimensionEnum.small:
        return '20cm x 20cm';
      case DesignDimensionEnum.medium:
        return '25cm x 25cm';
      case DesignDimensionEnum.large:
        return '30cm x 30cm';
    }
  }
}

