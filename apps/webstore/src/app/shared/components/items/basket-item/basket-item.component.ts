import { Component, Input, OnInit } from '@angular/core';
import { IDesign } from '@interfaces';
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
  @Input() item: IDesign;

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

  decreaseAmount() {
    if (this.item.amount > 1) {
      this.item.amount = this.item.amount - 1;
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

  increaseAmount() {
    this.item.amount = this.item.amount + 1;
    this.updatePrice();
  }

  increaseSize() {
    switch (this.item.size) {
      case 'small':
        this.item.size = 'medium';
        this.updatePrice();
        break;
      case 'medium':
        this.item.size = 'large';
        this.updatePrice();
        break;
      case 'large':
        this.toastService.showAlert(
          'This is the largest size that we offer',
          'Dette er den største størrelse du kan bestille',
          'danger',
          3000
        );
    }
  }

  decreaseSize() {
    switch (this.item.size) {
      case 'small':
        this.toastService.showAlert(
          'This is the smallest size that we offer',
          'Dette er den største størrelse du kan bestille',
          'danger',
          3000
        );
        break;
      case 'medium':
        this.item.size = 'small';
        this.updatePrice();
        break;
      case 'large':
        this.item.size = 'medium';
        this.updatePrice();
        break;
    }
  }
}
