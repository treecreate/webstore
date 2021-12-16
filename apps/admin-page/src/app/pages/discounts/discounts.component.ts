import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IDiscount } from '@interfaces';
import { ClipboardService } from 'ngx-clipboard';
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

  constructor(private discountsService: DiscountsService, private clipboardService: ClipboardService) {}

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
