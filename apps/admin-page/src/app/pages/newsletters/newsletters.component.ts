import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INewsletter, IOrder, ItemInfo } from '@interfaces';
import { NewsletterService } from '../../services/newsletter/newsletter.service';
import { OrdersService } from '../../services/orders/orders.service';

@Component({
  selector: 'webstore-newsletters',
  templateUrl: './newsletters.component.html',
  styleUrls: ['./newsletters.component.css', '../../../assets/styling/table.css'],
})
export class NewslettersComponent {
  newsletterList!: INewsletter[];
  orderList: IOrder[] = [];
  isLoading = false;
  displayedColumns: string[] = ['newsletterEmail', 'date', 'hasOrdered', 'actions'];
  isSafeMode = true;
  tableTopInfo: ItemInfo[] = [];

  constructor(
    private newsletterService: NewsletterService,
    private ordersService: OrdersService,
    private snackBar: MatSnackBar
  ) {
    this.fetchNewsletters();
    this.fetchOrders();
  }

  /**
   * Retrieve a list of newsletters.
   */
  fetchNewsletters(): void {
    this.isLoading = true;
    this.newsletterService.getNewsletters().subscribe({
      next: (response: INewsletter[]) => {
        this.newsletterList = response;
        this.isLoading = false;
        this.setTableInfo();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to retrieve the list of newsletters', 'Oh my, what will we do?', {
          duration: 10000,
        });
        this.isLoading = false;
      },
    });
  }

  /**
   * Get top table info
   */
  setTableInfo(): void {
    const timeStamp = new Date().getTime() - 2592000000;
    const amountOfNewsletters = this.newsletterList.length;
    const newSubscribers = this.newsletterList.filter(
      (newsletter) => timeStamp < new Date(newsletter.createdAt).getTime()
    ).length;

    this.tableTopInfo = [
      {
        description: 'New',
        amount: newSubscribers,
        color: 'green',
      },
      {
        description: 'Total subscribers',
        amount: amountOfNewsletters,
      },
    ];
  }

  /**
   * Fetch all orders through the api.
   */
  fetchOrders(): void {
    this.isLoading = true;
    this.ordersService.getOrders().subscribe(
      (listData: IOrder[]) => {
        this.orderList = listData;
        this.isLoading = false;
      },
      (err: HttpErrorResponse) => {
        console.error(err.message);
        this.snackBar.open('Failed to fetch orders', 'Doggo!', { duration: 10000 });
        this.isLoading = false;
      }
    );
  }

  /**
   * Check if the given email is associated with any orders.
   * @param email the email to check.
   * @returns whether or not it is associated with order.
   */
  hasOrdered(email: string): boolean {
    return this.orderList.filter((order) => order.contactInfo.email.toLowerCase() === email.toLowerCase()).length !== 0;
  }

  /**
   * Remove, if present, the newsletter entry for the given user.
   */
  unsubscribe(newsletterId: string): void {
    this.isLoading = true;

    if (this.isSafeMode) {
      if (!confirm('are you sure?')) {
        this.isLoading = false;
        return;
      }
    }

    this.newsletterService.unsubscribe(newsletterId).subscribe({
      next: () => {
        this.snackBar.open('The user has been unsubscribed');
        // remove the newsletter entry from the list
        this.newsletterList = this.newsletterList.filter(
          (newsletter: INewsletter) => newsletter.newsletterId !== newsletterId
        );
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to unsubscribe the user', 'Why??');
        this.isLoading = false;
      },
    });
  }
}
