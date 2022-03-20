import { Component, Input, OnInit } from '@angular/core';
import { DesignDimensionEnum, DesignTypeEnum, ITransactionItem } from '@interfaces';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';

@Component({
  selector: 'webstore-checkout-item',
  templateUrl: './family-tree-checkout-item.component.html',
  styleUrls: ['./family-tree-checkout-item.component.css'],
})
export class FamilyTreeCheckoutItemComponent implements OnInit {
  @Input() item: ITransactionItem;

  itemPrice: number;
  itemUnitPrice: number;
  public designTypeEnum = DesignTypeEnum;

  constructor(private calculatePriceService: CalculatePriceService) {}

  ngOnInit(): void {
    this.itemUnitPrice = this.calculatePriceService.calculateItemUnitPrice(
      this.item.dimension,
      this.item.design.designType
    );
    this.itemPrice = this.calculatePriceService.calculateItemPrice(this.item);
  }

  /**
   * Translate dimensions from an Enum value into a human readble string
   * @param dimension dimensions of the item
   * @param designType design type of the item
   * @returns string representing the design like '15cm x 15cm'
   */
  translateDimensionToCm(dimension: string, designType: DesignTypeEnum): string {
    switch (designType) {
      case DesignTypeEnum.familyTree: {
        switch (dimension) {
          case 'SMALL':
            return '20cm x 20cm';
          case 'MEDIUM':
            return '25cm x 25cm';
          case 'LARGE':
            return '30cm x 30cm';
        }
        break;
      }
      case DesignTypeEnum.quotable: {
        switch (dimension) {
          case 'SMALL':
            return '15cm x 15cm';
          case 'MEDIUM':
            return '20cm x 20cm';
          case 'LARGE':
            return '25cm x 25cm';
        }
        break;
      }
    }
  }
}
