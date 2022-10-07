import { Component, Input, OnInit } from '@angular/core';
import { DesignTypeEnum, ITransactionItem } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
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
  public designTypeEnum = DesignTypeEnum;

  public localeCode: LocaleType;
  public locale$: BehaviorSubject<LocaleType>;

  constructor(private calculatePriceService: CalculatePriceService, private localStorageService: LocalStorageService) {
    // Listen to changes to locale
    this.locale$ = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale);
    this.localeCode = this.locale$.getValue();
  }

  ngOnInit(): void {
    this.itemUnitPrice = this.calculatePriceService.calculateItemUnitPrice(
      this.item.dimension,
      this.item.design.designType
    );
    this.itemPrice = this.calculatePriceService.calculateItemPrice(this.item);
  }

  isEnglish(): boolean {
    return this.localeCode === 'en-US';
  }

  getDesignName() {
    switch (this.item.design.designType) {
      case DesignTypeEnum.quotable:
        // TODO: Get quotable product type
        return this.isEnglish() ? 'Quotable' : 'Citat ramme';
      case DesignTypeEnum.familyTree:
      default:
        return this.isEnglish() ? 'Family tree' : 'Stamtræ';
    }
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
            return '20x20cm';
          case 'MEDIUM':
            return '25x25cm';
          case 'LARGE':
            return '30x30cm';
        }
        break;
      }
      case DesignTypeEnum.quotable: {
        switch (dimension) {
          case 'SMALL':
            return '15x15cm';
          case 'MEDIUM':
            return '20x20cm';
          case 'LARGE':
            return '25x25cm';
        }
        break;
      }
    }
  }
}
