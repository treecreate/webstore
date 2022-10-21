import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { DesignTypeEnum, IQoutable, ITransactionItem, QuotableTypeEnum } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';

@Component({
  selector: 'webstore-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.css'],
})
export class CheckoutItemComponent implements OnInit, AfterContentInit {
  @Input() item: ITransactionItem;

  itemPrice: number;
  itemUnitPrice: number;
  isLoadingDesign = true;

  public designTypeEnum = DesignTypeEnum;
  public localeCode: LocaleType;

  constructor(private calculatePriceService: CalculatePriceService, private localStorageService: LocalStorageService) {
    this.localeCode = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).getValue();
  }

  ngOnInit(): void {
    this.itemUnitPrice = this.calculatePriceService.calculateItemUnitPrice(
      this.item.dimension,
      this.item.design.designType
    );
    this.itemPrice = this.calculatePriceService.calculateItemPrice(this.item);
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.isLoadingDesign = false;
    }, 100);
  }

  isEnglish(): boolean {
    return this.localeCode === 'en-US';
  }

  getDesignName(): string {
    switch (this.item.design.designType) {
      case DesignTypeEnum.familyTree:
        return this.isEnglish() ? 'Family tree' : 'Stamtræ';
      case DesignTypeEnum.petSign:
        return this.isEnglish() ? 'Pet sign' : 'Kæledyr skilt';
      case DesignTypeEnum.quotable:
      default:
        switch ((this.item.design.designProperties as IQoutable).quotableType) {
          case QuotableTypeEnum.babySign:
            return this.isEnglish() ? 'Baby sign' : 'Baby skilt';
          case QuotableTypeEnum.loveLetter:
            return this.isEnglish() ? 'Love letter' : 'Kærlighedsbrevet';
          case QuotableTypeEnum.quotable:
          default:
            return this.isEnglish() ? 'Quotable' : 'Citat ramme';
        }
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
      case DesignTypeEnum.petSign: {
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
