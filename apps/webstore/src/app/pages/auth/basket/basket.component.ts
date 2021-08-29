import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/components/toast/toast-service';

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
  basketItems = [
    {
      title: 'First design',
      size: 'small',
      amount: 2,
    },
    {
      title: 'Second design',
      size: 'large',
      amount: 1,
    },
    {
      title: 'Last design',
      size: 'medium',
      amount: 2,
    },
  ];
  public donatedTrees = 1;
  public discount = 0.1;
  discountForm: FormGroup;

  constructor(private toastService: ToastService) {
    this.discountForm = new FormGroup({
      discountCode: new FormControl('', [
        Validators.required,
        Validators.pattern('^\\S*$'),
      ]),
    });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

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

  calcDonationPrice() {
    return (this.donatedTrees - 1) * 10;
  }

  calcSubtotalPrice(): number {
    let sum = 0;
    for (let i = 0; i < this.basketItems.length; i++) {
      sum += this.calcItemPrice(
        this.basketItems[i].amount,
        this.basketItems[i].size
      );
    }
    return sum;
  }

  calcTotal(): number {
    return this.calcSubtotalPrice() * (1 - this.discount);
  }

  calcAmountSaved(): number {
    return this.calcSubtotalPrice() * this.discount;
  }

  calcItemPrice(amount: number, size: string) {
    switch (size) {
      case 'small':
        return amount * 495;
      case 'medium':
        return amount * 695;
      case 'large':
        return amount * 995;
    }
  }

  calcVat() {
    return this.calcTotal() * 0.2;
  }

  applyDiscount() {
    if (this.discountForm.get('discountCode').value == '123') {
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
}
