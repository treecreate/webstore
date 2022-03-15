import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiscountType, IDiscount } from '@interfaces';
import { ClipboardService } from 'ngx-clipboard';
import { CreateDiscountDialogComponent } from '../../components/create-discount-dialog/create-discount-dialog.component';
import { DiscountsService } from '../../services/discounts/discounts.service';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';

enum DiscountSortEnum {
  createdAt = 'createdAt',
  expiresAt = 'expiresAt',
  code = 'code',
}

enum DiscountState {
  future = 'Future',
  expired = 'Expired',
  active = 'Active',
  runOut = 'RunOut',
  disabled = 'Disabled',
}

@Component({
  selector: 'webstore-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.css'],
})
export class DiscountsComponent implements OnInit {
  isLoading = true;
  displayedColumns: string[] = ['code', 'id', 'usesLeft', 'used', 'startsAt', 'expiresAt', 'discount', 'actions'];
  discounts!: IDiscount[];
  discountDisplayList: IDiscount[] = [];
  showDisabled = false;
  showActive = true;
  showAsc = true;
  showAmount = true;
  showPercent = true;
  sortSelectForm: FormGroup;

  constructor(
    private discountsService: DiscountsService,
    private clipboardService: ClipboardService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private discountService: DiscountsService
  ) {
    this.sortSelectForm = new FormGroup({
      select: new FormControl(DiscountSortEnum.createdAt, Validators.required),
    });
  }

  /**
   * Fetches the discounts.
   */
  ngOnInit(): void {
    this.fetchDiscounts();
  }

  copyToClipboard(content: string): void {
    this.clipboardService.copyFromContent(content);
  }

  /**
   * Open create discount dialog.
   */
  openCreateDiscountDialog(): void {
    this.dialog.open(CreateDiscountDialogComponent, { width: '500px' });
  }

  /**
   * Fetches the discounts from the API.\
   * \
   * Will toggle `isLoading` to `true` while the discounts are being fetched
   * and revert it to `false` when they have been fetched.\
   * \
   * **Uses**: `discountsService` -> to call the API.
   */
  fetchDiscounts(): void {
    this.isLoading = true;
    this.discountsService.getDiscounts().subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      next: (discounts: IDiscount[]) => {
        this.isLoading = false;
        this.discounts = discounts;
        this.discountDisplayList = discounts;
        this.updateList();
      },
    });
  }

  /**
   * Takes a long string and shortens it to only 8 char.
   *
   * @param text
   * @returns a shortened string
   */
  getShortText(text: string, end: boolean): string {
    if (end) {
      return text.slice(text.length - 8);
    } else {
      return text.slice(0, 10);
    }
  }

  /**
   * Updates the list of discounts based off active / disabled
   */
  updateList(): void {
    this.discountDisplayList = [];

    // Check to display active
    if (this.showActive) {
      this.discountDisplayList = this.discountDisplayList.concat(
        this.discounts.filter((discount) => discount.isEnabled)
      );
    }
    // Check to display default
    if (this.showDisabled) {
      this.discountDisplayList = this.discountDisplayList.concat(
        this.discounts.filter((discount) => !discount.isEnabled)
      );
    }

    // Check to display amount and/or percent
    if (this.showAmount && this.showPercent) {
      this.sortData();
      return;
    } else if (this.showAmount) {
      // Only show amount
      this.discountDisplayList = this.discountDisplayList.filter((discount) => discount.type !== DiscountType.amount);
    } else if (this.showPercent) {
      // Only show percent
      this.discountDisplayList = this.discountDisplayList.filter((discount) => discount.type !== DiscountType.percent);
    } else {
      this.discountDisplayList = [];
    }
    this.sortData();
  }

  /**
   * Sorts the data of the table.
   */
  sortData(): void {
    const data = this.discountDisplayList.slice();

    const sort: Sort = {
      active: this.sortSelectForm.get('select')?.value,
      direction: this.showAsc ? 'asc' : 'desc',
    };
    const isAsc = sort.direction === 'asc';

    this.discountDisplayList = data.sort((a, b) => {
      switch (sort.active) {
        case 'createdAt':
          if (a.createdAt && b.createdAt) {
            return this.compare(a.createdAt, b.createdAt, isAsc);
          }
          return 0;
        case 'expiresAt':
          if (a.expiresAt && b.expiresAt) {
            return this.compare(a.expiresAt, b.expiresAt, isAsc);
          }
          return 0;
        case 'startsAt':
          if (a.startsAt && b.startsAt) {
            return this.compare(a.startsAt, b.startsAt, isAsc);
          }
          return 0;
        case 'code':
          return this.compare(a.discountCode, b.discountCode, isAsc);
        default:
          return 0;
      }
    });
  }

  /**
   * Compares two elements.
   *
   * @param a element a.
   * @param b element b.
   * @param isAsc is sorted ascended.
   * @returns the result of the comparison.
   */
  compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  /**
   * @param date discount expiration date
   * @returns boolean of whether or not the date has passed
   */
  hasExpired(date: Date): boolean {
    return new Date(date) < new Date();
  }

  /**
   * @param date discount starts at date
   * @returns boolean of whether or not the discount hasnt started yet
   */
  isInTheFuture(date: Date): boolean {
    return new Date(date) > new Date();
  }

  /**
   * @param discount
   * @returns discount state enum
   */
  getDiscountState(discount: IDiscount): string {
    if (discount.startsAt && discount.expiresAt) {
      // Check if is active
      if (!discount.isEnabled) return DiscountState.disabled;
      // Check if is in the future
      if (this.isInTheFuture(discount.startsAt)) return DiscountState.future;
      // Check if it expired
      if (this.hasExpired(discount.expiresAt)) return DiscountState.expired;
      // Check if it has uses left
      if (discount.remainingUses < 1) return DiscountState.runOut;
    }
    return DiscountState.active;
  }

  /**
   * Performs a API call in order to either enable or disable a discount.\
   * Changes the state of isLoading variable whilst the update is on-going.
   *
   * @param id discount id
   */
  toggleDiscountState(id: string): void {
    const discountToToggle = this.discounts.find((discount) => discount.discountId === id);
    // validate that the request and its information is valid
    if (discountToToggle === undefined || discountToToggle?.discountId === undefined) {
      return;
    }
    this.discountService
      .updateDiscount(discountToToggle.discountId, { isEnabled: !discountToToggle.isEnabled })
      .subscribe({
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.snackBar.open(
            `Failed to change discount state with error: ${error.error.error}`,
            `Cool, Let's try again`,
            { duration: 5000 }
          );
        },
        next: () => {
          this.snackBar.open(`Discount has been ${discountToToggle.isEnabled ? 'enabled' : 'disabled'}`, 'Ya Yeet', {
            duration: 3500,
          });
          location.reload();
        },
      });
  }
}
