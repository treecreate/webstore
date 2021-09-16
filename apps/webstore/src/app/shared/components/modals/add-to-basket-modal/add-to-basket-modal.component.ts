import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from '@interfaces';
import { UserRoles } from '@models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'webstore-add-to-basket-modal',
  templateUrl: './add-to-basket-modal.component.html',
  styleUrls: ['./add-to-basket-modal.component.scss'],
})
export class AddToBasketModalComponent implements OnInit {
  // TODO: get actual items in basket from API
  mockUser: IUser = {
    userId: '1',
    email: 'mock@hotdeals.dev',
    roles: [UserRoles.user],
    isVerified: true,
  };

  addToBasketForm: FormGroup;
  price: number;
  isMoreThan4: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private calculatePriceService: CalculatePriceService
  ) {}

  ngOnInit(): void {
    this.addToBasketForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3),
      ]),
      amount: new FormControl('', [
        Validators.required,
        Validators.max(99),
        Validators.min(1),
      ]),
      size: new FormControl('', [Validators.required]),
    });

    this.addToBasketForm.setValue({
      title: '',
      amount: 1,
      size: '20cm x 20cm',
    });

    this.updatePrice();
  }

  submit() {
    if (this.addToBasketForm.get('title').invalid) {
      this.toastService.showAlert(
        'Missing title (min 3 letters, max 50)',
        'Titel mangler (min 3 bokstaver, max 50)',
        'danger',
        4000
      );
    } else {
      // TODO: send the design to basket
      console.log('perfect');
    }
  }

  updatePrice() {
    this.price = this.calculatePriceService.calculateItemPriceAlternative(
      this.addToBasketForm.get('amount').value,
      this.addToBasketForm.get('size').value
    );

    // ( addToBasketForm.get('amount') + all basket items )
    this.isMoreThan4 = this.calculatePriceService.isMoreThan4Items([
      {
        transactionItemId: '',
        order: null,
        design: null,
        dimension: this.addToBasketForm.get('size').value,
        quantity: this.addToBasketForm.get('amount').value,
      },
      // TODO: add the list of items that are already in basket
    ]);
  }

  increaseAmount() {
    this.addToBasketForm.setValue({
      title: this.addToBasketForm.get('title').value,
      amount: this.addToBasketForm.get('amount').value + 1,
      size: this.addToBasketForm.get('size').value,
    });
    this.updatePrice();
  }

  decreaseAmount() {
    if (this.addToBasketForm.get('amount').value > 1) {
      this.addToBasketForm.setValue({
        title: this.addToBasketForm.get('title').value,
        amount: this.addToBasketForm.get('amount').value - 1,
        size: this.addToBasketForm.get('size').value,
      });
      this.updatePrice();
    }
  }

  increaseSize() {
    switch (this.addToBasketForm.get('size').value) {
      case '20cm x 20cm':
        this.addToBasketForm.setValue({
          title: this.addToBasketForm.get('title').value,
          amount: this.addToBasketForm.get('amount').value,
          size: '25cm x 25cm',
        });
        break;
      case '25cm x 25cm':
        this.addToBasketForm.setValue({
          title: this.addToBasketForm.get('title').value,
          amount: this.addToBasketForm.get('amount').value,
          size: '30cm x 30cm',
        });
        break;
      case '30cm x 30cm':
        this.toastService.showAlert(
          "We don't sell larger designs. For special requests you can send us an e-mail: info@treecreate.dk",
          'Vi sælger ikke større designs. For specielle henvendelser kan du sende os en e-mail: info@treecreate.dk',
          'danger',
          3000
        );
        break;
    }
    this.updatePrice();
  }

  decreaseSize() {
    switch (this.addToBasketForm.get('size').value) {
      case '20cm x 20cm':
        this.toastService.showAlert(
          "We don't have smaller sizes",
          'Vi har ikke mindre størrelser',
          'danger',
          3000
        );
        break;
      case '25cm x 25cm':
        this.addToBasketForm.setValue({
          title: this.addToBasketForm.get('title').value,
          amount: this.addToBasketForm.get('amount').value,
          size: '20cm x 20cm',
        });
        break;
      case '30cm x 30cm':
        this.addToBasketForm.setValue({
          title: this.addToBasketForm.get('title').value,
          amount: this.addToBasketForm.get('amount').value,
          size: '25cm x 25cm',
        });
        break;
    }
    this.updatePrice();
  }
}
