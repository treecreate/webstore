import { HttpErrorResponse } from '@angular/common/http';
import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  DesignDimensionEnum,
  DesignTypeEnum,
  ErrorlogPriorityEnum,
  IAuthUser,
  IQoutable,
  ITransactionItem,
  QuotableTypeEnum,
} from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../services/authentication/auth.service';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';
import { ErrorlogsService } from '../../../services/errorlog/errorlog.service';
import { EventsService } from '../../../services/events/events.service';
import { TransactionItemService } from '../../../services/transaction-item/transaction-item.service';

@Component({
  selector: 'webstore-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.css', '../../../../../assets/styles/tc-input-field.scss'],
})
export class BasketItemComponent implements OnInit, AfterContentInit {
  @Output()
  priceChangeEvent = new EventEmitter();

  @Output()
  deleteItemEvent = new EventEmitter();

  @Input()
  item: ITransactionItem;

  @Input()
  index: number;

  itemPrice: number;
  isLoading = false;
  isLoadingDesign = true;
  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };
  public isLoggedIn: boolean;
  private authUser$: BehaviorSubject<IAuthUser>;
  public designTypeEnum = DesignTypeEnum;
  public localeCode: LocaleType;

  constructor(
    private calculatePriceService: CalculatePriceService,
    private transactionItemService: TransactionItemService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router,
    private eventsService: EventsService,
    private errorlogsService: ErrorlogsService
  ) {
    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn = this.authUser$.getValue() != null && this.authService.isAccessTokenValid();
    });
    this.localeCode = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).getValue();
  }

  ngOnInit(): void {
    this.updateTransactionItem();
    this.itemPrice = this.calculatePriceService.calculateItemPrice(this.item);
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.isLoadingDesign = false;
    }, 100);
  }

  updatePrice(): void {
    this.priceChangeEvent.emit({ newItem: this.item, index: this.index });
    this.updateTransactionItem();
    this.itemPrice = this.calculatePriceService.calculateItemPrice(this.item);
  }

  isEnglish(): boolean {
    return this.localeCode === 'en-US';
  }

  getDesignName(): string {
    switch (this.item.design.designType) {
      case DesignTypeEnum.familyTree:
        return this.isEnglish() ? 'Family tree' : 'Stamtræ';
      case DesignTypeEnum.petSign:
        return this.isEnglish() ? 'Pet sign' : 'Kæledyrs skilt';
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

  goToDesign(): void {
    if (this.isLoggedIn) {
      // use design.designId for logged in users
      switch (this.item.design.designType) {
        case DesignTypeEnum.familyTree: {
          this.router.navigate(['/products/family-tree'], {
            queryParams: { designId: this.item.design.designId },
          });
          break;
        }
        case DesignTypeEnum.quotable: {
          this.router.navigate(['/products/quotable'], {
            queryParams: { designId: this.item.design.designId },
          });
          break;
        }
        case DesignTypeEnum.petSign: {
          this.router.navigate(['/products/pet-sign'], {
            queryParams: { designId: this.item.design.designId },
          });
          break;
        }
      }
    } else {
      // Go to design using index => will load from LS transactionItem list
      switch (this.item.design.designType) {
        case DesignTypeEnum.familyTree: {
          this.router.navigate(['/products/family-tree'], {
            queryParams: { designId: this.index },
          });
          break;
        }
        case DesignTypeEnum.quotable: {
          this.router.navigate(['/products/quotable'], {
            queryParams: { designId: this.index },
          });
          break;
        }
        case DesignTypeEnum.petSign: {
          this.router.navigate(['/products/pet-sign'], {
            queryParams: { designId: this.index },
          });
          break;
        }
      }
    }
    this.scrollTop();
  }

  decreaseQuantity(): void {
    this.isLoading = true;
    if (this.item.quantity > 1) {
      this.item.quantity = this.item.quantity - 1;
      this.updatePrice();
    }
  }

  increaseQuantity(): void {
    this.isLoading = true;
    this.item.quantity = this.item.quantity + 1;
    this.updatePrice();
  }

  increaseDimension(): void {
    this.isLoading = true;
    switch (this.item.dimension) {
      case DesignDimensionEnum.small:
        this.item.dimension = DesignDimensionEnum.medium;
        this.updatePrice();
        break;
      case DesignDimensionEnum.medium:
        this.item.dimension = DesignDimensionEnum.large;
        this.updatePrice();
        break;
    }
  }

  decreaseDimension(): void {
    this.isLoading = true;
    switch (this.item.dimension) {
      case DesignDimensionEnum.medium:
        this.item.dimension = DesignDimensionEnum.small;
        this.updatePrice();
        break;
      case DesignDimensionEnum.large:
        this.item.dimension = DesignDimensionEnum.medium;
        this.updatePrice();
        break;
    }
  }

  updateTransactionItem(): void {
    // Check if user is logged in
    if (this.isLoggedIn) {
      // Update DB transaction item
      this.updateTransactionItemDB();
    } else {
      // Update localstorage item
      const currentItemsList = this.localStorageService.getItem<ITransactionItem[]>(
        LocalStorageVars.transactionItems
      ).value;
      currentItemsList[this.index] = this.item;

      this.localStorageService.setItem(LocalStorageVars.transactionItems, currentItemsList);
      this.isLoading = false;
    }
  }

  updateTransactionItemDB(): void {
    this.transactionItemService
      .updateTransactionItem(this.item.transactionItemId, {
        quantity: this.item.quantity,
        dimension: this.item.dimension,
      })
      .subscribe({
        next: (item: ITransactionItem) => {
          this.item = item;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.errorlogsService.create(
            'webstore.basket-item.update-transaction-item-failed',
            ErrorlogPriorityEnum.high,
            error
          );
          this.alert = {
            message: 'Failed to display the transaction item',
            type: 'danger',
            dismissible: false,
          };
          this.isLoading = false;
        },
      });
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

  deleteTransactionItem(): void {
    this.isLoading = true;
    if (this.isLoggedIn) {
      // Delete transactionItem from DB
      this.deleteItemFromDB();
    } else {
      // Delete transactionItem from localstorage
      // Get items from localstorage
      const currentItemsList = this.localStorageService.getItem<ITransactionItem[]>(
        LocalStorageVars.transactionItems
      ).value;

      // Remove item from list
      currentItemsList.splice(this.index, 1);

      // Update localstorage
      this.localStorageService.setItem(LocalStorageVars.transactionItems, currentItemsList);
      this.deleteItemEvent.emit(this.index);
      this.isLoading = false;

      // Log the removal
      this.eventsService.create('webstore.basket-item.basket-item-removed.local-storage');
    }
  }

  deleteItemFromDB(): void {
    const transactionId = this.item.transactionItemId;
    this.transactionItemService.deleteTransactionItem(transactionId).subscribe(
      () => {
        this.isLoading = false;
        this.alert = {
          message: 'Set item for deletion',
          type: 'success',
          dismissible: false,
        };
        this.item = null;
        this.deleteItemEvent.emit(this.index);
        this.eventsService.create('webstore.basket-item.basket-item-removed.db');
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.errorlogsService.create(
          'webstore.basket-item.delete-transaction-item-failed',
          ErrorlogPriorityEnum.high,
          error
        );
        this.alert = {
          message: 'Failed to fully delete the transaction item',
          type: 'danger',
          dismissible: false,
        };
        this.isLoading = false;
      }
    );
  }
  scrollTop(): void {
    window.scrollTo(0, 0);
  }
}
