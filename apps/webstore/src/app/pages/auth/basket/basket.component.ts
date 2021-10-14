import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DiscountType,
  IDiscount,
  IPricing,
  ITransactionItem,
} from '@interfaces';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { CalculatePriceService } from '../../../shared/services/calculate-price/calculate-price.service';
import { DiscountService } from '../../../shared/services/discount/discount.service';
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

  donatedTrees = 1;
  discount: IDiscount = null;
  discountIsLoading = false;

  discountForm: FormGroup;
  priceInfo: IPricing;

  constructor(
    private toastService: ToastService,
    private calculatePriceService: CalculatePriceService,
    private transactionItemService: TransactionItemService,
    private discountService: DiscountService
  ) {
    this.discountForm = new FormGroup({
      discountCode: new FormControl('', [
        Validators.required,
        Validators.pattern('^\\S*$'),
      ]),
    });
    this.priceInfo = this.calculatePriceService.calculatePrices(
      this.itemList,
      this.discount,
      false,
      this.donatedTrees - 1
    );
  }

  ngOnInit(): void {
    console.warn("DISCOUNT: ", this.discount);
    this.getItemList();
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

  updatePrices() {
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
          console.log(this.discount);
          this.updatePrices();
          this.discountIsLoading = false;
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
}
