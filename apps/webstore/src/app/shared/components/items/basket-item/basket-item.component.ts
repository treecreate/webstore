import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DesignDimensionEnum, ITransactionItem } from '@interfaces';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';
import { TransactionItemService } from '../../../services/transaction-item/transaction-item.service';
import { FamilyTreeMiniatureComponent } from '../../products/family-tree/family-tree-miniature/family-tree-miniature.component';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'webstore-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: [
    './basket-item.component.css',
    '../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class BasketItemComponent implements OnInit {
  @ViewChild('productDesign', { static: true })
  miniature: FamilyTreeMiniatureComponent;

  @Input() item: ITransactionItem;
  itemPrice: number;
  isLoading = false;
  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  constructor(
    private toastService: ToastService,
    private calculatePriceService: CalculatePriceService,
    private transactionItemService: TransactionItemService
  ) {}

  ngOnInit(): void {
    this.updatePrice();
  }

  updatePrice() {
    this.itemPrice = this.calculatePriceService.calculateItemPrice(this.item);
  }

  decreaseQuantity() {
    if (this.item.quantity > 1) {
      this.item.quantity = this.item.quantity - 1;
      this.updateTransactionItem();
      this.updatePrice();
    } else {
      this.toastService.showAlert(
        "Press Delete if you don't wish to purchase this design.",
        'Tryk Delete hvis du ikke ønsker at købe designet.',
        'danger',
        3000
      );
    }
  }

  increaseQuantity() {
    this.item.quantity = this.item.quantity + 1;
    this.updateTransactionItem();
    this.updatePrice();
  }

  increaseSize() {
    switch (this.item.dimension) {
      case DesignDimensionEnum.small:
        this.item.dimension = DesignDimensionEnum.medium;
        this.updatePrice();
        break;
      case DesignDimensionEnum.medium:
        this.item.dimension = DesignDimensionEnum.large;
        this.updatePrice();
        break;
      case DesignDimensionEnum.large:
        this.toastService.showAlert(
          'This is the largest size that we offer',
          'Dette er den største størrelse du kan bestille',
          'danger',
          3000
        );
        break;
    }
    this.updateTransactionItem();
  }

  decreaseSize() {
    switch (this.item.dimension) {
      case DesignDimensionEnum.small:
        this.toastService.showAlert(
          'This is the smallest size that we offer',
          'Dette er den mindste størrelse du kan bestille',
          'danger',
          3000
        );
        break;
      case DesignDimensionEnum.medium:
        this.item.dimension = DesignDimensionEnum.small;
        this.updatePrice();
        break;
      case DesignDimensionEnum.large:
        this.item.dimension = DesignDimensionEnum.medium;
        this.updatePrice();
        break;
    }
    this.updateTransactionItem();
  }

  updateTransactionItem() {
    this.transactionItemService
      .updateTransactionItem(this.item.transactionItemId, {
        quantity: this.item.quantity,
        dimension: this.item.dimension,
      })
      .subscribe(
        (item: ITransactionItem) => {
          this.isLoading = false;
          this.item = item;
          console.log('Fetched transaction item', item);
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

  deleteTransactionItem() {
    this.transactionItemService
      .deleteTransactionItem(this.item.transactionItemId)
      .subscribe(
        () => {
          this.isLoading = false;
          this.alert = {
            message: 'Set item for deletion',
            type: 'success',
            dismissible: false,
          };
          this.item = null;
          console.log('Deleted transaction item');
          // TODO - self-destruct the component
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
}
