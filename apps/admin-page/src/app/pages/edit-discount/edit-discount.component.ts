import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DiscountType, IDiscount } from '@interfaces';
import { DiscountsService } from '../../services/discounts/discounts.service';

@Component({
  selector: 'webstore-edit-discount',
  templateUrl: './edit-discount.component.html',
  styleUrls: ['./edit-discount.component.css'],
})
export class EditDiscountComponent implements OnInit {
  discount?: IDiscount;
  id?: string;
  isLoading = true;
  discountTypeOptions = [DiscountType.amount, DiscountType.percent];

  // Discount information
  discountForm: FormGroup;

  /**
   * Initliaze the disocunt form
   * @param discountService service for discount-related http calls and logic
   * @param route angular route for getting url params
   * @param location used for navigating through browser history
   * @param snackBar material UI module for alerts
   */
  constructor(
    public discountService: DiscountsService,
    private route: ActivatedRoute,
    private location: Location,
    private snackBar: MatSnackBar
  ) {
    this.discountForm = new FormGroup({
      discountCode: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      usesLeft: new FormControl('', [Validators.required, Validators.min(0)]),
      expiresAt: new FormControl('', [Validators.required]),
      startsAt: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.min(0)]),
      type: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    // Fetching the discount.
    if (this.id !== undefined) {
      this.fetchDiscount(this.id);
    }
  }

  /**
   * Redirects to the previous page.
   */
  historyBack(): void {
    this.location.back();
  }

  /**
   * Fetches a discount from the API.\
   * \
   * Will toggle `isLoading` to `true` while the discount is being fetched
   * and revert it to `false` when it has been fetched.\
   * Initializes all of the discount related values.\
   * \
   * **Uses**: `discountService` -> to call the API.
   */
  fetchDiscount(id: string): void {
    this.isLoading = true;
    this.discountService.getDiscountById(id).subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      next: (discount: IDiscount) => {
        this.isLoading = false;
        this.discount = discount;

        this.patchDiscountForm(discount);
      },
    });
  }

  /**
   * Performs a API call in order to update the discount entity based on the discount form information.\
   * Changes the state of isLoading variable whilst the update is on-going
   */
  updateDiscount(): void {
    if (!this.isFormValid && this.isFormDirty) {
      return;
    }
    this.isLoading = true;
    this.discountService
      .updateDiscount(this.discount?.discountId!, {
        discountCode: this.discountForm.get('discountCode')?.value,
        remainingUses: this.discountForm.get('usesLeft')?.value,
        expiresAt: this.discountForm.get('expiresAt')?.value,
        startsAt: this.discountForm.get('startsAt')?.value,
        amount: this.discountForm.get('amount')?.value,
        type: this.discountForm.get('type')?.value,
      })
      .subscribe({
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.snackBar.open(
            `Failed to update the discount with error: ${error.error.error}`,
            `Cool, Let's try again`,
            { duration: 5000 }
          );
          this.isLoading = false;
        },
        next: (discount: IDiscount) => {
          this.discountForm.markAsPristine();
          this.snackBar.open(`Discount has been updated`);
          this.patchDiscountForm(discount);
          this.isLoading = false;
        },
      });
    console.log('Discount form: ', this.discountForm?.get('discountCode')?.value);
  }

  /**
   * Updates the discount form with the provided data
   * @param discount discount information
   */
  patchDiscountForm(discount: IDiscount): void {
    this.discountForm.patchValue({
      discountCode: discount.discountCode,
      usesLeft: discount.remainingUses,
      expiresAt: this.discount?.expiresAt || '',
      startsAt: this.discount?.startsAt || '',
      amount: discount.amount,
      type: discount.type,
    });
  }

  /**
   * Checks whether the discount form fields are valid
   * @returns whether the form fields are valid
   */
  isFormValid(): boolean {
    return this.discount === undefined || this.discountForm.valid;
  }

  /**
   * Checks whether the discount form has been modified
   * @returns whether the form has been modified
   */
  isFormDirty(): boolean {
    return this.discountForm.dirty;
  }
}
