import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
   */
  constructor(public discountService: DiscountsService, private route: ActivatedRoute, private location: Location) {
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

        this.discountForm.patchValue({
          discountCode: discount.discountCode,
          usesLeft: discount.remainingUses,
          expiresAt: this.discount?.expiresAt || '',
          startsAt: this.discount?.startsAt || '',
          amount: discount.amount,
          type: discount.type,
        });
      },
    });
  }
}
