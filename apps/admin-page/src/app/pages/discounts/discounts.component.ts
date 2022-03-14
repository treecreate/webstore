import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDiscount } from '@interfaces';
import { ClipboardService } from 'ngx-clipboard';
import { CreateDiscountDialogComponent } from '../../components/create-discount-dialog/create-discount-dialog.component';
import { DiscountsService } from '../../services/discounts/discounts.service';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'webstore-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.css'],
})
export class DiscountsComponent implements OnInit {
  isLoading = true;
  displayedColumns: string[] = ['code', 'id', 'usesLeft', 'used', 'expiresAt', 'actions'];
  discounts!: IDiscount[];

  constructor(
    private discountsService: DiscountsService,
    private clipboardService: ClipboardService,
    private dialog: MatDialog
  ) {}

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
        this.sortData({active: 'createdAt', direction: 'asc'});
      },
    });
  }

  /**
   * Sorts the data of the table.
   *
   * @param sort
   */
   sortData(sort: Sort) {
    const data = this.discounts.slice();

    if (!sort.active || sort.direction === '') {
      this.discounts = data;
      return;
    }

    this.discounts = data.sort((a, b) => {      
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'createdAt':
          return this.compare(a.createdAt!, b.createdAt!, isAsc);
        case 'expiresAt':
          return this.compare(a.expiresAt!, b.expiresAt!, isAsc);
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
}
