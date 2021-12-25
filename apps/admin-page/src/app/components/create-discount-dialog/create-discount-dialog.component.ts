import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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

  /**
   * Initialise the create password form.
   *
   * @param discountService
   * @param snackbar
   * @param dialog
   */
  constructor(private discountService: DiscountsService, private snackbar: MatSnackBar, private dialog: MatDialog) {
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

  /**
   * @param date
   * @returns The date in a dateTime format
   */
  getDateTime(date: string): Date {
    return new Date(date);
  }

  /**
   * Calls the service with a request to create the discount.
   */
  createDiscount(): void {
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
          this.dialog.closeAll();
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.snackbar.open('Failed to create discount sadly :(((', 'SH*** HOLY', { duration: 5000 });
        }
      );
  }
}
