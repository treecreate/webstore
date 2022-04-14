import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INewsletter } from '@interfaces';
import { NewsletterService } from '../../services/newsletter/newsletter.service';

@Component({
  selector: 'webstore-newsletters',
  templateUrl: './newsletters.component.html',
  styleUrls: ['./newsletters.component.css'],
})
export class NewslettersComponent {
  newsletterList!: INewsletter[];
  isLoading = false;
  displayedColumns: string[] = ['newsletterEmail', 'date', 'hasOrdered', 'actions'];

  constructor(private newsletterService: NewsletterService, private snackBar: MatSnackBar) {
    this.fetchNewsletters();
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
   * Remove, if present, the newsletter entry for the given user.
   */
  unsubscribe(newsletterId: string): void {
    this.isLoading = true;
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
