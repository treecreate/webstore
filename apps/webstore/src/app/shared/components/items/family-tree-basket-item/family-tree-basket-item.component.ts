import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DesignDimensionEnum, ITransactionItem } from '@interfaces';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';
import { TransactionItemService } from '../../../services/transaction-item/transaction-item.service';
import { FamilyTreeMiniatureComponent } from '../../products/family-tree/family-tree-miniature/family-tree-miniature.component';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'webstore-basket-item',
  templateUrl: './family-tree-basket-item.component.html',
  styleUrls: [
    './family-tree-basket-item.component.css',
    '../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class FamilyTreeBasketItemComponent implements OnInit {
  @ViewChild('productDesign', { static: true })
  miniature: FamilyTreeMiniatureComponent;
  @Output() priceChangeEvent = new EventEmitter();
  @Output() deleteItemEvent = new EventEmitter();
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
    this.priceChangeEvent.emit(this.item);
    this.updateTransactionItem();
    this.itemPrice = this.calculatePriceService.calculateItemPrice(this.item);
  }

  decreaseQuantity() {
    this.isLoading = true;
    if (this.item.quantity > 1) {
      this.item.quantity = this.item.quantity - 1;
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
    this.transactionItemService
      .updateTransactionItem(this.item.transactionItemId, {
        quantity: this.item.quantity,
        dimension: this.item.dimension,
      })
      .subscribe(
        (item: ITransactionItem) => {
          this.item = item;
          console.log('Fetched transaction item', item);
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

  deleteTransactionItem() {
    this.isLoading = true;
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
        this.deleteItemEvent.emit(transactionId);
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
