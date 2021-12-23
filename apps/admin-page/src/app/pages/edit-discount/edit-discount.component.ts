import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IDiscount } from '@interfaces';
import { Location } from '@angular/common';
import { DiscountsService } from '../../services/discounts/discounts.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'webstore-edit-discount',
  templateUrl: './edit-discount.component.html',
  styleUrls: ['./edit-discount.component.css'],
})
export class EditDiscountComponent implements OnInit {
  discount?: IDiscount;
  id?: string;
  isLoading = true;

  // Discount information
  discountForm: FormGroup | undefined;

  constructor(public discountService: DiscountsService, private route: ActivatedRoute, private location: Location) {}

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
    this.discountService.getDiscounts().subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      next: (discounts: IDiscount[]) => {
        this.isLoading = false;
        this.discount = discounts.find((discount) => discount.discountId === id);

        const expiresAt = this.discount?.expiresAt || '';
        const createdAt = this.discount?.createdAt || '';

        // Discount Information
        this.discountForm = new FormGroup({
          discountCodeControl: new FormControl(this.discount?.discountCode, [
            Validators.required,
            Validators.maxLength(50),
          ]),
          usesLeftControl: new FormControl(this.discount?.remainingUses, [Validators.required, Validators.min(0)]),
          expirationDateControl: new FormControl(new Date(expiresAt).toLocaleDateString(), [Validators.required]),
          amountControl: new FormControl(this.discount?.amount, [Validators.required, Validators.min(0)]),
          typeControl: new FormControl(this.discount?.type, [Validators.required]),
          startDateControl: new FormControl(new Date(createdAt).toLocaleDateString(), [Validators.required]),
        });
      },
    });
  }
}
