import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsletterService } from '../../../shared/services/order/newsletter/newsletter.service';

@Component({
  selector: 'webstore-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: [
    './unsubscribe.component.css',
    '../../../../assets/styles/tc-buttons.css',
  ],
})
export class UnsubscribeComponent implements OnInit {
  isLoading = false;
  isUnsubscribeSuccessful = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private newsletterService: NewsletterService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.unsubscribeUser(this.route.snapshot.params.newsletterId);
  }

  unsubscribeUser(newsletterId: string) {
    this.newsletterService.unsubscribe(newsletterId).subscribe(
      () => {
        this.isUnsubscribeSuccessful = true;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.isUnsubscribeSuccessful = false;
        this.isLoading = false;
        if (error.error.status === 400) {
          this.errorMessage = 'The provided data is invalid';
        } else if (error.error.status === 404) {
          this.errorMessage = 'Provided newsletter subscription was not found';
        } else if (error.error.message === undefined) {
          this.errorMessage = 'Failed to connect to the backend service';
        } else {
          this.errorMessage = error.error.message;
        }
      }
    );
  }
}
