import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TreeDesignEnum } from '@assets';
import {
  DesignDimensionEnum,
  DesignTypeEnum,
  DiscountType,
  FamilyTreeFontEnum,
  IDiscount,
  IPricing,
  ITransactionItem,
  IUser,
} from '@interfaces';
import { UserRoles } from '@models';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { CalculatePriceService } from '../../../shared/services/calculate-price/calculate-price.service';
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
  // TODO: get actual items in basket from API
  mockUser: IUser = {
    userId: '1',
    email: 'mock@hotdeals.dev',
    roles: [UserRoles.user],
    isVerified: true,
  };

  itemList: ITransactionItem[] = [];
  isLoading = false;
  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  donatedTrees = 1;
  discount: IDiscount = {
    amount: 100,
    type: DiscountType.amount,
  };

  discountForm: FormGroup;
  priceInfo: IPricing;

  constructor(
    private toastService: ToastService,
    private calculatePriceService: CalculatePriceService,
    private transactionItemService: TransactionItemService
  ) {
    this.discountForm = new FormGroup({
      discountCode: new FormControl('', [
        Validators.required,
        Validators.pattern('^\\S*$'),
      ]),
    });
  }

  ngOnInit(): void {
    this.updatePrices();

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
        if (error.error.message !== undefined) {
          this.alert = {
            message: error.error.message,
            type: 'danger',
            dismissible: false,
          };
        } else {
          this.alert = {
            message: 'Failed to connect to the backend service',
            type: 'danger',
            dismissible: false,
          };
        }
        this.isLoading = false;
        this.alert = undefined;
      }
    );

    console.log(this.priceInfo);
  }

  updatePrices() {
    this.priceInfo = this.calculatePriceService.calculatePrices(
      this.itemList,
      this.discount,
      false,
      this.donatedTrees - 1
    );
    console.log('Updated price info', this.priceInfo);
  }

  decreaseDonatingAmount() {
    if (this.donatedTrees > 1) {
      this.donatedTrees = this.donatedTrees - 1;
    } else {
      this.toastService.showAlert(
        'Planting a tree is included in the price.',
        'Det er includeret i prisen at du planter 1 træ.',
        'danger',
        3000
      );
    }
  }

  applyDiscount() {
    if (this.discountForm.get('discountCode').value === '123') {
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
    } else {
      this.toastService.showAlert(
        'Invalid discount code',
        'Ugyldig rabatkode',
        'danger',
        4000
      );
    }
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
