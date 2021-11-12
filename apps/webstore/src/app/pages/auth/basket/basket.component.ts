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
import { LocalStorageVars } from '@models';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { CalculatePriceService } from '../../../shared/services/calculate-price/calculate-price.service';
import { DiscountService } from '../../../shared/services/discount/discount.service';
import { LocalStorageService } from '@local-storage';
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
    if (this.discount !== null) {
      this.discountForm
        .get('discountCode')
        .setValue(this.discount.discountCode);
    }
    this.plantedTrees = this.localStorageService.getItem<number>(
      LocalStorageVars.plantedTrees
    ).value;
    if (this.plantedTrees === null) {
      this.plantedTrees = 1;
    }
    this.user = this.localStorageService.getItem<IUser>(
      LocalStorageVars.authUser
    ).value;
    if (this.user !== null) {
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
      this.updatePrices();
      this.router.navigate(['/checkout']);
    } else {
      this.toastService.showAlert(
        'You have to verify your e-mail to continue.',
        'Du skal verificere din e-mail før du kan fortsætte.',
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

  isMoreThan3(): boolean {
    let totalItems = 0;
    for (let i = 0; i < this.itemList.length; i++) {
      totalItems += this.itemList[i].quantity;
    }
    return totalItems > 3;
  }

  updatePrices() {
    // validate the isMoreThan3 rule if there is no other discount applied
    if (
      this.discount === null ||
      this.discount.discountCode === 'ismorethan3=true'
    ) {
      if (this.isMoreThan3()) {
        this.discount = {
          discountCode: 'ismorethan3=true',
          type: DiscountType.percent,
          amount: 25,
          remainingUses: 9999,
          totalUses: 1,
        };
      } else {
        this.discount = null;
      }
      this.discountForm.get('discountCode').setValue(null);
      this.localStorageService.setItem<IDiscount>(
        LocalStorageVars.discount,
        this.discount
      );
    }
    this.priceInfo = this.calculatePriceService.calculatePrices(
      this.itemList,
      this.discount,
      false,
      this.plantedTrees
    );
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
          console.log('Discount changed to: ', this.discount);
          this.discountIsLoading = false;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.toastService.showAlert(
            'Invalid discount code',
            'Ugyldig rabatkode',
            'danger',
            4000
          );
          this.discount = null;
          this.discountForm.get('discountCode').setValue(null);
          this.discountIsLoading = false;
        }
      )
      .add(() => {
        console.log('Setting disocunt to: ', this.discount);
        this.localStorageService.setItem<IDiscount>(
          LocalStorageVars.discount,
          this.discount
        );
        this.updatePrices();
      });
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  decreaseDonation() {
    if (this.plantedTrees > 1) {
      this.plantedTrees--;
      this.localStorageService.setItem<number>(
        LocalStorageVars.plantedTrees,
        this.plantedTrees
      );
      this.updatePrices();
    }
  }

  increaseDonation() {
    this.plantedTrees++;
    this.localStorageService.setItem<number>(
      LocalStorageVars.plantedTrees,
      this.plantedTrees
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
