import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DiscountType, IAuthUser, IDiscount, IPricing, ITransactionItem, IUser } from '@interfaces';
import { LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { CalculatePriceService } from '../../../shared/services/calculate-price/calculate-price.service';
import { DiscountService } from '../../../shared/services/discount/discount.service';
import { LocalStorageService } from '@local-storage';
import { TransactionItemService } from '../../../shared/services/transaction-item/transaction-item.service';

@Component({
  selector: 'webstore-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss', '../../../../assets/styles/tc-input-field.scss'],
})
export class BasketComponent implements OnInit {
  itemList: ITransactionItem[] = [];
  private authUser$: BehaviorSubject<IAuthUser>;
  isLoading = false;
  isLoggedIn = false;
  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };
  user: IUser;

  plantedTrees = 1;
  discount: IDiscount = null;
  discountIsLoading = false;

  discountForm: FormGroup;
  priceInfo: IPricing;

  constructor(
    private toastService: ToastService,
    private calculatePriceService: CalculatePriceService,
    private transactionItemService: TransactionItemService,
    private discountService: DiscountService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private authService: AuthService
  ) {
    // Create discount form
    this.discountForm = new FormGroup({
      discountCode: new FormControl('', [Validators.required, Validators.pattern('^\\S*$')]),
    });

    // Get discount from localstorage
    this.discount = this.localStorageService.getItem<IDiscount>(LocalStorageVars.discount).value;

    // Check if discount in localstorage exists
    if (this.discount !== null) {
      this.discountForm.get('discountCode').setValue(this.discount.discountCode);
    }

    // Get planted trees from localstorage
    this.plantedTrees = this.localStorageService.getItem<number>(LocalStorageVars.plantedTrees).value;
    if (this.plantedTrees === null) {
      this.plantedTrees = 1;
    }

    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn = this.authUser$.getValue() != null && this.authService.isAccessTokenValid();
    });

    this.user = this.localStorageService.getItem<IUser>(LocalStorageVars.authUser).value;
  }

  ngOnInit(): void {
    this.getItemList();
    this.updatePrices();
  }

  goToCheckout() {
    this.scrollTop();
    this.updatePrices();
    this.router.navigate(['/checkout']);
  }

  getItemList() {
    this.isLoading = true;
    // Check if user is logged in
    if (this.isLoggedIn) {
      // Get items from database
      this.getItemListFromDB();
    } else {
      // Get items from localstorage
      const localStorageItemsList = this.localStorageService.getItem<ITransactionItem[]>(
        LocalStorageVars.transactionItems
      ).value;
      // Check if the localstorage list contains transactionItems
      if (localStorageItemsList !== null) {
        this.itemList = localStorageItemsList;
      }
      this.isLoading = false;
    }
  }

  getItemListFromDB() {
    this.transactionItemService.getTransactionItems().subscribe(
      (itemList: ITransactionItem[]) => {
        this.itemList = itemList;
        this.updatePrices();
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.alert = {
          message: 'Failed to get a list of items',
          type: 'danger',
          dismissible: false,
        };
        this.isLoading = false;
      }
    );
  }

  isMoreThan3(): boolean {
    let totalItems = 0;
    for (let i = 0; i < this.itemList.length; i++) {
      totalItems += this.itemList[i].quantity;
    }
    return totalItems > 3;
  }

  updatePrices() {
    // validate the isMoreThan3 rule if there is no other discount applied
    if (this.discount === null || this.discount.discountCode === 'ismorethan3=true') {
      if (this.isMoreThan3()) {
        this.discount = {
          discountCode: 'ismorethan3=true',
          type: DiscountType.percent,
          amount: 25,
          remainingUses: 9999,
          totalUses: 1,
          isEnabled: true,
        };
      } else {
        this.discount = null;
      }
      this.discountForm.get('discountCode').setValue(null);
      this.localStorageService.setItem<IDiscount>(LocalStorageVars.discount, this.discount);
    }
    this.priceInfo = this.calculatePriceService.calculatePrices(this.itemList, this.discount, false, this.plantedTrees);
  }

  applyDiscount() {
    // Don't try to fetch a discount if the field is empty
    if (this.discountForm.get('discountCode').value === '') {
      this.discount = null;
      this.updatePrices();
      return;
    }
    this.discountIsLoading = true;
    this.discountService
      .getDiscount(this.discountForm.get('discountCode').value)
      .subscribe(
        (discount: IDiscount) => {
          const expires = new Date(discount.expiresAt);
          const starts = new Date(discount.startsAt);

          // Check remaining uses
          if (discount.remainingUses <= 0) {
            this.toastService.showAlert(
              'The discount code: ' + this.discountForm.get('discountCode').value + ' has been used!',
              'Rabat koden: ' + this.discountForm.get('discountCode').value + ' er brugt!',
              'danger',
              4000
            );

            // Check experation date
          } else if (expires.getTime() < Date.now()) {
            this.toastService.showAlert(
              'The discount code: ' + this.discountForm.get('discountCode').value + ' has expired!',
              'Rabat koden: ' + this.discountForm.get('discountCode').value + ' er udløbet!',
              'danger',
              4000
            );
          } else if (!discount.isEnabled || starts.getTime() > Date.now()) {
            // TODO - properly translate the danish version of the alert (is invalid)
            this.toastService.showAlert(
              'The discount code: ' + this.discountForm.get('discountCode').value + ' is invalid!',
              'Rabat koden: ' + this.discountForm.get('discountCode').value + ' is invalid!',
              'danger',
              4000
            );
            // Activate discount
          } else {
            this.toastService.showAlert(
              'Your discount code: ' + this.discountForm.get('discountCode').value + ' has been activated!',
              'Din rabat kode: ' + this.discountForm.get('discountCode').value + ' er aktiveret!',
              'success',
              4000
            );
            this.discount = discount;
            console.log('Discount changed to: ', this.discount);
          }
          this.discountIsLoading = false;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.toastService.showAlert('Invalid discount code', 'Ugyldig rabatkode', 'danger', 4000);
          this.discount = null;
          this.discountForm.get('discountCode').setValue(null);
          this.discountIsLoading = false;
        }
      )
      .add(() => {
        this.localStorageService.setItem<IDiscount>(LocalStorageVars.discount, this.discount);
        this.updatePrices();
      });
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  decreaseDonation() {
    if (this.plantedTrees > 1) {
      this.plantedTrees--;
      this.localStorageService.setItem<number>(LocalStorageVars.plantedTrees, this.plantedTrees);
      this.updatePrices();
    }
  }

  increaseDonation() {
    this.plantedTrees++;
    this.localStorageService.setItem<number>(LocalStorageVars.plantedTrees, this.plantedTrees);
    this.updatePrices();
  }

  itemPriceChange(data) {
    this.itemList[data.index] = data.newItem;
    this.updatePrices();
  }

  deleteItemChange(id) {
    this.itemList = this.itemList.filter((item) => item.transactionItemId !== id);
    if (!this.isLoggedIn) {
      // update list from localstorage
      this.itemList = this.localStorageService.getItem<ITransactionItem[]>(LocalStorageVars.transactionItems).value;
    }
    location.reload();
  }
}
