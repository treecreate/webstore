import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDiscount } from '@interfaces';
import { ClipboardService } from 'ngx-clipboard';
import { CreateDiscountDialogComponent } from '../../components/create-discount-dialog/create-discount-dialog.component';
import { DiscountsService } from '../../services/discounts/discounts.service';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';

enum DiscountSortEnum {
  createdAt = "createdAt",
  expiresAt = "expiresAt",
  code = "code"
}

@Component({
  selector: 'webstore-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.css'],
})
export class DiscountsComponent implements OnInit {
  isLoading = true;
  displayedColumns: string[] = ['code', 'id', 'usesLeft', 'used', 'createdAt', 'expiresAt', 'actions'];
  discounts!: IDiscount[];
  discountDisplayList: IDiscount[] = [];
  showDisabled = false;
  showActive = true;
  sortSelectForm: FormGroup;

  constructor(
    private discountsService: DiscountsService,
    private clipboardService: ClipboardService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private discountService: DiscountsService
  ) {
    this.sortSelectForm = new FormGroup({
      select: new FormControl(DiscountSortEnum.createdAt, Validators.required)
    })
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
        this.updateShow();
      },
    });
  }

  getShortText(text: string): string {
    return text.slice(text.length - 8);
  }

  updateShow(): void {
    this.discountDisplayList = [];
    const activeDiscounts = this.discounts.filter((discount) => discount.isEnabled);
    const disabledDiscounts = this.discounts.filter((discount) => !discount.isEnabled);

    if (this.showActive) {
      this.discountDisplayList = this.discountDisplayList.concat(activeDiscounts);
    }
    if (this.showDisabled) {
      this.discountDisplayList = this.discountDisplayList.concat(disabledDiscounts);
    }
    this.sortData();
  }

  /**
   * Sorts the data of the table.
   */
  sortData() {
    const data = this.discountDisplayList.slice();
    const sort: Sort = {
      active: this.sortSelectForm.get('select')?.value,
      direction: 'asc'
    }

    this.discountDisplayList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'createdAt':
          return this.compare(a.createdAt!, b.createdAt!, isAsc);
        case 'expiresAt':
          return this.compare(a.expiresAt!, b.expiresAt!, isAsc);
        case 'code':
          return this.compare(a.discountCode!, b.discountCode!, isAsc);
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
   * Performs a API call in order to either enable or disable a discount.\
   * Changes the state of isLoading variable whilst the update is on-going.
   */
  toggleDiscountState(id: string): void {
    const discount = this.discounts.find((discount) => discount.discountId! === id);
    // validate that the request and its information is valid
    if (discount === undefined || discount?.discountId === undefined) {
      return;
    }
    this.isLoading = true;
    this.discountService.updateDiscount(discount.discountId, { isEnabled: !discount.isEnabled }).subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.snackBar.open(
          `Failed to change discount state with error: ${error.error.error}`,
          `Cool, Let's try again`,
          { duration: 5000 }
        );
        this.isLoading = false;
      },
      next: (discount: IDiscount) => {
        this.snackBar.open(`Discount has been ${discount.isEnabled ? 'enabled' : 'disabled'}`, 'Ya Yeet', {
          duration: 3500,
        });
        this.isLoading = false;
      },
    });
  }
}
