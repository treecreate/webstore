import { Component, OnInit } from '@angular/core';
import { DesignDimensionEnum, DesignFontEnum, DesignTypeEnum, IQoutable } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { TransactionItemService } from '../../../shared/services/transaction-item/transaction-item.service';

const baconIpsum = [
  'Tail leberkas boudin swine burgdoggen meatball pork loin chicken venison shankle shank beef spare ribs filet mignon tri-tip',
  ' Turkey leberkas swine, meatball corned beef strip steak doner cow. Alcatra ribeye chicken prosciutto, leberkas salami pork belly shankle short loin',
  '  Porchetta pancetta landjaeger, t-bone biltong beef boudin picanha chuck swine',
  '  Filet mignon flank ribeye, beef short loin shankle swine kevin landjaeger sirloin buffalo short ribs alcatra',
  '  Tri-tip turkey salami spare ribs, hamburger andouille pork loin chicken sirloin cow burgdoggen',
  '  Leberkas doner jerky landjaeger, ham hock pork belly sirloin shoulder swine spare ribs ball tip',
  '  Swine short loin pastrami doner, prosciutto hamburger pork spare ribs pork belly brisket chicken rump fatback meatloaf',
  '  Tongue pork chop filet mignon shankle',
  '  Sirloin bacon short loin pork, biltong turducken porchetta t-bone short ribs tongue',
];

@Component({
  selector: 'webstore-quotable',
  templateUrl: './quotable.component.html',
  styleUrls: ['./quotable.component.scss'],
})
export class QuotableComponent implements OnInit {
  constructor(
    private localStorageService: LocalStorageService,
    private transactionItemService: TransactionItemService
  ) {}

  quote = 'Yeet';

  ngOnInit() {
    this.quote = baconIpsum[Math.floor(Math.random() * baconIpsum.length)];
  }

  /**
   * Temporary method to test adding quotables to the basket
   * @param size the size of the qoutable as a string. ['small, 'medium', 'large']
   */
  buyQuotable(size: string): void {
    switch (size) {
      case 'small':
        console.log('smoll');
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designQuotable, {
          font: DesignFontEnum.roboto,
        });

        this.transactionItemService.saveToLocalStorage(
          {
            designProperties: {
              font: DesignFontEnum.roboto,
            },
            dimension: DesignDimensionEnum.small,
            quantity: 2,
          },
          DesignTypeEnum.quotable
        );
        break;
      case 'medium':
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designQuotable, {
          font: DesignFontEnum.roboto,
        });

        this.transactionItemService.saveToLocalStorage(
          {
            designProperties: {
              font: DesignFontEnum.roboto,
            },
            dimension: DesignDimensionEnum.medium,
            quantity: 2,
          },
          DesignTypeEnum.quotable
        );
        console.log('medium');
        break;
      case 'large':
        console.log('Your mom (large)');
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designQuotable, {
          font: DesignFontEnum.roboto,
        });

        this.transactionItemService.saveToLocalStorage(
          {
            designProperties: {
              font: DesignFontEnum.roboto,
            },
            dimension: DesignDimensionEnum.large,
            quantity: 2,
          },
          DesignTypeEnum.quotable
        );
        break;
      default:
        console.log("I don't know you're trying to add fix your sizing boi");
    }
  }
}
