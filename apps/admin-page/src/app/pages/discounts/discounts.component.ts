import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDiscount } from '@interfaces';
import { ClipboardService } from 'ngx-clipboard';
import { CreateDiscountDialogComponent } from '../../components/create-discount-dialog/create-discount-dialog.component';
import { DiscountsService } from '../../services/discounts/discounts.service';

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
      },
    });
  }
}
