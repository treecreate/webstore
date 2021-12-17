import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  discountCodeControl!: FormControl;
  usesLeftControl!: FormControl;
  expirationDateControl!: FormControl;
  amountControl!: FormControl;
  typeControl!: FormControl;
  startDateControl!: FormControl;

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

        // Discount Information
        this.discountCodeControl = new FormControl(this.discount?.discountCode);
        this.usesLeftControl = new FormControl(this.discount?.remainingUses);
        if (this.discount?.expiresAt) {
          this.expirationDateControl = new FormControl(new Date(this.discount?.expiresAt).toLocaleDateString());
        }
        this.amountControl = new FormControl(this.discount?.amount);
        this.typeControl = new FormControl(this.discount?.type);
        if (this.discount?.createdAt) {
          this.startDateControl = new FormControl(new Date(this.discount.createdAt).toLocaleDateString());
        }
      },
    });
  }
}
