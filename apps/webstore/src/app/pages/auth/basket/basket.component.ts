import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  DiscountType,
  IDiscount,
  IPricing,
  ITransactionItem,
  IUser,
} from '@interfaces';
import { LocalStorageVars, UserRoles } from '@models';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { CalculatePriceService } from '../../../shared/services/calculate-price/calculate-price.service';
import { DiscountService } from '../../../shared/services/discount/discount.service';
import { LocalStorageService } from '../../../shared/services/local-storage';
import { TransactionItemService } from '../../../shared/services/transaction-item/transaction-item.service';

@Component({
  selector: 'webstore-basket',
  templateUrl: './basket.component.html',
  styleUrls: [
    './basket.component.scss',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class BasketComponent implements OnInit {
  itemList: ITransactionItem[] = [];
  isLoading = false;
  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };
  user: IUser;
  isVerified = false;

  donatedTrees = 1;
  discountInput: IDiscount = null;
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
    private router: Router
  ) {
    this.discountForm = new FormGroup({
      discountCode: new FormControl('', [
        Validators.required,
        Validators.pattern('^\\S*$'),
      ]),
    });
    this.discount = this.localStorageService.getItem<IDiscount>(
      LocalStorageVars.discount
    ).value;
    this.donatedTrees = this.localStorageService.getItem<number>(
      LocalStorageVars.extraDonatedTrees
    ).value;
    this.user = this.localStorageService.getItem<IUser>(
      LocalStorageVars.authUser
    ).value;
    if (this.user != undefined) {
      this.isVerified = this.user.isVerified;
    }
    this.updatePrices();
  }

  ngOnInit(): void {
    this.getItemList();
  }

  goToCheckout() {
    this.scrollTop();
    if (this.isVerified) {
      this.router.navigate(['/checkout']);
    } else {
      this.toastService.showAlert(
        'You have to verify you email to continue.',
        'Du skal verificere din email før du kan fortsætte.',
        'danger',
        10000
      );
    }
  }

  getItemList() {
    this.isLoading = true;
    this.transactionItemService.getTransactionItems().subscribe(
      (itemList: ITransactionItem[]) => {
        this.isLoading = false;
        this.itemList = itemList;
        console.log('Fetched transaction items', itemList);
        this.updatePrices();
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

  isMoreThan3() {
    let totalItems = 0;
    for (let i = 0; i < this.itemList.length; i++) {
      totalItems += this.itemList[i].quantity;
    }
    if (4 <= totalItems) {
      this.discount = {
        discountCode: 'ismorethan3=true',
        type: DiscountType.percent,
        amount: 25,
        remainingUses: 9999,
        totalUses: 1,
      };
      console.warn('discount changed to: ', this.discount);
    } else {
      this.discount = this.discountInput;
    }
  }

  updatePrices() {
    this.isMoreThan3();
    this.priceInfo = this.calculatePriceService.calculatePrices(
      this.itemList,
      this.discount,
      false,
      this.donatedTrees - 1
    );
  }

  applyDiscount() {
    this.discountIsLoading = true;
    this.discountService
      .getDiscount(this.discountForm.get('discountCode').value)
      .subscribe(
        (discount: IDiscount) => {
          this.toastService.showAlert(
            'Your discount code: ' +
              this.discountForm.get('discountCode').value +
              ' has been activated!',
            'Din rabat kode: ' +
              this.discountForm.get('discountCode').value +
              ' er aktiveret!',
            'success',
            4000
          );
          this.discount = discount;
          this.discountInput = discount;
          console.log(this.discount);
          this.updatePrices();
          this.discountIsLoading = false;
          this.localStorageService.setItem<IDiscount>(
            LocalStorageVars.discount,
            this.discount
          );
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
          this.toastService.showAlert(
            'Invalid discount code',
            'Ugyldig rabatkode',
            'danger',
            4000
          );
          this.discountIsLoading = false;
        }
      );
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  decreaseDonation() {
    if (this.donatedTrees > 1) {
      this.donatedTrees = this.donatedTrees - 1;
      this.localStorageService.setItem<number>(
        LocalStorageVars.extraDonatedTrees,
        this.donatedTrees
      );
      this.updatePrices();
    }
  }

  increaseDonation() {
    this.donatedTrees = this.donatedTrees + 1;
    this.localStorageService.setItem<number>(
      LocalStorageVars.extraDonatedTrees,
      this.donatedTrees
    );
    this.updatePrices();
  }

  itemPriceChange(newItem) {
    const oldItem = this.itemList.find(
      (item) => item.transactionItemId === newItem.transactionItemId
    );
    const itemIndex = this.itemList.indexOf(oldItem);
    this.itemList[itemIndex] = newItem;
    this.updatePrices();
  }

  deleteItemChange(id) {
    this.itemList = this.itemList.filter(
      (item) => item.transactionItemId !== id
    );
    this.updatePrices();
  }
}
