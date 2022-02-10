import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DesignDimensionEnum, IAuthUser, ITransactionItem } from '@interfaces';
import { LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../services/authentication/auth.service';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';
import { LocalStorageService } from '@local-storage';
import { TransactionItemService } from '../../../services/transaction-item/transaction-item.service';
import { FamilyTreeMiniatureComponent } from '../../products/family-tree/family-tree-miniature/family-tree-miniature.component';

@Component({
  selector: 'webstore-basket-item',
  templateUrl: './family-tree-basket-item.component.html',
  styleUrls: ['./family-tree-basket-item.component.css', '../../../../../assets/styles/tc-input-field.scss'],
})
export class FamilyTreeBasketItemComponent implements OnInit {
  @ViewChild('productDesign', { static: true })
  miniature: FamilyTreeMiniatureComponent;
  @Output() priceChangeEvent = new EventEmitter();
  @Output() deleteItemEvent = new EventEmitter();
  @Input() item: ITransactionItem;
  @Input() index: number;
  itemPrice: number;
  isLoading = false;
  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };
  public isLoggedIn: boolean;
  private authUser$: BehaviorSubject<IAuthUser>;

  constructor(
    private calculatePriceService: CalculatePriceService,
    private transactionItemService: TransactionItemService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router
  ) {
    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn = this.authUser$.getValue() != null && this.authService.isAccessTokenValid();
    });
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

  goToDesign() {
    if (this.isLoggedIn) {
      // use design.designId for logged in users
      this.router.navigate(['/product'], {
        queryParams: { designId: this.item.design.designId },
      });
    } else {
      // Go to design using index => will load from LS transactionItem list
      this.router.navigate(['/product'], {
        queryParams: { designId: this.index },
      });
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
      .subscribe(
        (item: ITransactionItem) => {
          this.item = item;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          console.error(error);

          this.alert = {
            message: 'Failed to display the transaction item',
            type: 'danger',
            dismissible: false,
          };
          this.isLoading = false;
        }
      );
  }

  translateDimension(dimension: string): string {
    switch (dimension) {
      case 'SMALL':
        return '20cm x 20cm';
      case 'MEDIUM':
        return '25cm x 25cm';
      case 'LARGE':
        return '30cm x 30cm';
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
      },
      (error: HttpErrorResponse) => {
        console.error(error);

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
