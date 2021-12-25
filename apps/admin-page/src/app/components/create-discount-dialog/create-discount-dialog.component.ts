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

  constructor(private discountService: DiscountsService, private snackbar: MatSnackBar) {
    this.createDiscountForm = new FormGroup({
      discountCode: new FormControl('', [Validators.min(3), Validators.required]),
      startsAt: new FormControl(new Date(), [Validators.required]),
      expiresAt: new FormControl('', [Validators.required]),
      remainingUses: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      type: new FormControl(DiscountType.amount, [Validators.required]),
      isEnabled: new FormControl(false, [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    });
  }

  createDiscount(): void {
    this.discountService
      .createDiscount({
        discountCode: this.createDiscountForm.get('discountCode')?.value,
        expiresAt: this.createDiscountForm.get('expiresAt')?.value,
        startsAt: this.createDiscountForm.get('startsAt')?.value,
        isEnabled: this.createDiscountForm.get('isEnabled')?.value,
        totalUses: 0,
        mount: this.createDiscountForm.get('amount')?.value,
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
