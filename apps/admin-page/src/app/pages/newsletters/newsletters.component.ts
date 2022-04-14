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
    // Retrieve a list of newsletters.
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
}
