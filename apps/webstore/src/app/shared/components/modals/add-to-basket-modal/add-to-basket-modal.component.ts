import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-add-to-basket-modal',
  templateUrl: './add-to-basket-modal.component.html',
  styleUrls: ['./add-to-basket-modal.component.scss'],
})
export class AddToBasketModalComponent implements OnInit {
  addToBasketForm: FormGroup;

  constructor(public activeModal: NgbActiveModal) {}

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
  }

  increaseAmount() {
    console.log('object');
    this.addToBasketForm.setValue({
      title: this.addToBasketForm.get('title').value,
      amount: this.addToBasketForm.get('amount').value + 1,
      size: this.addToBasketForm.get('size').value,
    });
  }

  decreaseAmount() {
    if (this.addToBasketForm.get('amount').value > 1) {
      this.addToBasketForm.setValue({
        title: this.addToBasketForm.get('title').value,
        amount: this.addToBasketForm.get('amount').value - 1,
        size: this.addToBasketForm.get('size').value,
      });
    } else {
      // TODO: alert
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
        // TODO: alert
        break;
    }
  }

  decreaseSize() {
    switch (this.addToBasketForm.get('size').value) {
      case '20cm x 20cm':
        // TODO: alert
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
  }
}
