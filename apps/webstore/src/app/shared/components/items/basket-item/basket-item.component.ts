import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DesignDimensionEnum, DesignTypeEnum, ErrorlogPriorityEnum, IAuthUser, ITransactionItem } from '@interfaces';
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
export class BasketItemComponent implements OnInit {
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
  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };
  public isLoggedIn: boolean;
  private authUser$: BehaviorSubject<IAuthUser>;
  public designTypeEnum = DesignTypeEnum;
  public localeCode: LocaleType;
  public locale$: BehaviorSubject<LocaleType>;

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
    // Listen to changes to locale
    this.locale$ = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale);
    this.localeCode = this.locale$.getValue();
  }

  ngOnInit(): void {
    this.updateTransactionItem();
    this.itemPrice = this.calculatePriceService.calculateItemPrice(this.item);
  }

  updatePrice() {
    this.priceChangeEvent.emit({ newItem: this.item, index: this.index });
    this.updateTransactionItem();
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

  goToDesign() {
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
      }
    }
    this.scrollTop();
  }

  decreaseQuantity() {
    this.isLoading = true;
    if (this.item.quantity > 1) {
      this.item.quantity = this.item.quantity - 1;
      this.updatePrice();
    }
  }

  increaseQuantity() {
    this.isLoading = true;
    this.item.quantity = this.item.quantity + 1;
    this.updatePrice();
  }

  increaseDimension() {
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

  decreaseDimension() {
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

  updateTransactionItem() {
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

  updateTransactionItemDB() {
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
    }
  }

  deleteTransactionItem() {
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

  deleteItemFromDB() {
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
  scrollTop() {
    window.scrollTo(0, 0);
  }
}
