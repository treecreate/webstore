import { Component, Input, OnInit } from '@angular/core';
import { DesignDimensionEnum, ITransactionItem } from '@interfaces';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';
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
  @Input() item: ITransactionItem;

  itemPrice: number;

  constructor(
    private toastService: ToastService,
    private calculatePriceService: CalculatePriceService
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
  }
}
