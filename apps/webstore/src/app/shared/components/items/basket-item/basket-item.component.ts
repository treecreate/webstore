import { Component, Input, OnInit } from '@angular/core';
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
  @Input() item;

  constructor(private toastService: ToastService) {}

  decreaseAmount() {
    if (this.item.amount > 0) {
      this.item.amount = this.item.amount - 1;
    } else {
      this.toastService.showAlert(
        "Press Delete if you don't wish to purchase this design.",
        'Tryk Delete hvis du ikke ønsker at købe designet.',
        'danger',
        3000
      );
    }
  }

  increaseSize() {
    switch (this.item.size) {
      case 'small':
        this.item.size = 'medium';
        break;
      case 'medium':
        this.item.size = 'large';
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
        break;
      case 'large':
        this.item.size = 'medium';
        break;
    }
  }

  calcPrice(size: string, amount: number) {
    switch (size) {
      case 'small':
        return 495 * amount;
      case 'medium':
        return 695 * amount;
      case 'large':
        return 995 * amount;
    }
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
