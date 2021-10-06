import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DesignDimensionEnum, IUser } from '@interfaces';
import { UserRoles } from '@models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';
import { LocalStorageService } from '../../../services/local-storage';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'webstore-add-to-basket-modal',
  templateUrl: './add-to-basket-modal.component.html',
  styleUrls: ['./add-to-basket-modal.component.scss'],
})
export class AddToBasketModalComponent implements OnInit {
  addToBasketForm: FormGroup;
  price: number;
  isMoreThan4: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private calculatePriceService: CalculatePriceService,
  ) {}

  ngOnInit(): void {
    this.addToBasketForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3),
      ]),
      quantity: new FormControl('', [
        Validators.required,
        Validators.max(99),
        Validators.min(1),
      ]),
      dimension: new FormControl('', [Validators.required]),
    });
    this.addToBasketForm.setValue({
      title: '',
      quantity: 1,
      dimension: DesignDimensionEnum.small,
    });

    this.updatePrice();
  }

  submit() {
    if (
      this.addToBasketForm.get('title').dirty &&
      this.addToBasketForm.get('title').invalid
    ) {
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
      this.addToBasketForm.get('quantity').value,
      this.addToBasketForm.get('dimension').value
    );

    // ( addToBasketForm.get('quantity') + all basket items )
    this.isMoreThan4 = this.calculatePriceService.isMoreThan4Items([
      {
        transactionItemId: '',
        order: null,
        design: null,
        dimension: this.addToBasketForm.get('dimension').value,
        quantity: this.addToBasketForm.get('quantity').value,
      },
      // TODO: add the list of items that are already in basket
    ]);
  }

  increaseQuantity() {
    this.addToBasketForm.setValue({
      title: this.addToBasketForm.get('title').value,
      quantity: this.addToBasketForm.get('quantity').value + 1,
      dimension: this.addToBasketForm.get('dimension').value,
    });
    this.updatePrice();
  }

  decreaseQuantity() {
    if (this.addToBasketForm.get('quantity').value > 1) {
      this.addToBasketForm.setValue({
        title: this.addToBasketForm.get('title').value,
        quantity: this.addToBasketForm.get('quantity').value - 1,
        dimension: this.addToBasketForm.get('dimension').value,
      });
      this.updatePrice();
    }
  }

  increaseSize() {
    switch (this.addToBasketForm.get('dimension').value) {
      case DesignDimensionEnum.small:
        this.addToBasketForm.setValue({
          title: this.addToBasketForm.get('title').value,
          quantity: this.addToBasketForm.get('quantity').value,
          dimension: DesignDimensionEnum.medium,
        });
        break;
      case DesignDimensionEnum.medium:
        this.addToBasketForm.setValue({
          title: this.addToBasketForm.get('title').value,
          quantity: this.addToBasketForm.get('quantity').value,
          dimension: DesignDimensionEnum.large,
        });
        break;
      case DesignDimensionEnum.large:
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
    switch (this.addToBasketForm.get('dimension').value) {
      case DesignDimensionEnum.small:
        this.toastService.showAlert(
          "We don't have smaller sizes",
          'Vi har ikke mindre størrelser',
          'danger',
          3000
        );
        break;
      case DesignDimensionEnum.medium:
        this.addToBasketForm.setValue({
          title: this.addToBasketForm.get('title').value,
          quantity: this.addToBasketForm.get('quantity').value,
          dimension: DesignDimensionEnum.small,
        });
        break;
      case DesignDimensionEnum.large:
        this.addToBasketForm.setValue({
          title: this.addToBasketForm.get('title').value,
          quantity: this.addToBasketForm.get('quantity').value,
          dimension: DesignDimensionEnum.medium,
        });
        break;
    }
    this.updatePrice();
  }
}
