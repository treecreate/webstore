import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiscountType } from '@interfaces';
import { DiscountsService } from '../../services/discounts/discounts.service';

@Component({
  selector: 'webstore-create-discount-dialog',
  templateUrl: './create-discount-dialog.component.html',
  styleUrls: ['./create-discount-dialog.component.css'],
})
export class CreateDiscountDialogComponent {
  createDiscountForm: UntypedFormGroup;
  checked = true;
  isLoading = false;

  /**
   * Initialise the create password form.
   *
   * @param discountService
   * @param snackbar
   * @param dialog
   */
  constructor(private discountService: DiscountsService, private snackbar: MatSnackBar, private dialog: MatDialog) {
    this.createDiscountForm = new UntypedFormGroup({
      discountCode: new UntypedFormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required,
      ]),
      startsAt: new UntypedFormControl(new Date(), [Validators.required]),
      expiresAt: new UntypedFormControl('', [Validators.required]),
      remainingUses: new UntypedFormControl(1, [Validators.required, Validators.pattern('^[0-9]*$')]),
      type: new UntypedFormControl(DiscountType.amount, [Validators.required]),
      isEnabled: new UntypedFormControl(this.checked, [Validators.required]),
      amount: new UntypedFormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
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
    this.isLoading = true;
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
        () => {
          this.snackbar.open('Discount created!', 'HOLY SH***', { duration: 2500 });
          document.location.reload();
          this.dialog.closeAll();
          this.isLoading = false;
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.snackbar.open('Failed to create discount sadly :(((', 'SH*** HOLY', { duration: 5000 });
          this.isLoading = false;
        }
      );
  }
}
