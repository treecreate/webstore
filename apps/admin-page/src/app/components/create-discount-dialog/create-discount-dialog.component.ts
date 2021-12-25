import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiscountType, IDiscount } from '@interfaces';
import { DiscountsService } from '../../services/discounts/discounts.service';

@Component({
  selector: 'webstore-create-discount-dialog',
  templateUrl: './create-discount-dialog.component.html',
  styleUrls: ['./create-discount-dialog.component.css'],
})
export class CreateDiscountDialogComponent {
  createDiscountForm: FormGroup;
  checked = true;

  constructor(private discountService: DiscountsService, private snackbar: MatSnackBar) {
    this.createDiscountForm = new FormGroup({
      discountCode: new FormControl('', [Validators.maxLength(50), Validators.minLength(3), Validators.required]),
      startsAt: new FormControl(''),
      expiresAt: new FormControl('', [Validators.required]),
      remainingUses: new FormControl(1, [Validators.required, Validators.pattern('^[0-9]*$')]),
      type: new FormControl(DiscountType.amount, [Validators.required]),
      isEnabled: new FormControl(this.checked, [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    });
  }

  getDateTime(date: string): Date {
    return new Date(date);
  }

  show() {
    console.log(this.createDiscountForm.get('isEnabled')?.value);
  }

  createDiscount(): void {
    console.log({
      discountCode: this.createDiscountForm.get('discountCode')?.value,
      expiresAt: this.getDateTime(this.createDiscountForm.get('expiresAt')?.value),
      startsAt: this.getDateTime(this.createDiscountForm.get('startsAt')?.value) || new Date(),
      isEnabled: this.createDiscountForm.get('isEnabled')?.value,
      remainingUses: this.createDiscountForm.get('remainingUses')?.value,
      totalUses: 0,
      amount: this.createDiscountForm.get('amount')?.value,
      type: this.createDiscountForm.get('type')?.value,
    });
    this.discountService
      .createDiscount({
        discountCode: this.createDiscountForm.get('discountCode')?.value,
        expiresAt: this.getDateTime(this.createDiscountForm.get('expiresAt')?.value),
        startsAt: this.getDateTime(this.createDiscountForm.get('startsAt')?.value) || new Date(),
        isEnabled: this.createDiscountForm.get('isEnabled')?.value,
        remainingUses: this.createDiscountForm.get('remainingUses')?.value,
        totalUses: 0,
        amount: this.createDiscountForm.get('amount')?.value,
        type: this.createDiscountForm.get('type')?.value,
      })
      .subscribe(
        (data: IDiscount) => {
          console.log(data);
          this.snackbar.open('Discount created!', 'HOLY SH***', { duration: 2500 });
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.snackbar.open('Failed to create discount sadly :(((', 'SH*** HOLY', { duration: 5000 });
        }
      );
  }
}
