import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsletterService } from '../../../shared/services/newsletter/newsletter.service';

@Component({
  selector: 'webstore-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css'],
})
export class UnsubscribeComponent implements OnInit {
  isLoading = false;
  unsubscribeSuccessful = false;

  constructor(
    private route: ActivatedRoute,
    private newsletterService: NewsletterService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.unsubscribeUser(this.route.snapshot.params.token);
  }

  unsubscribeUser(newsletterId: string) {
    this.newsletterService.unsubscribe(newsletterId).subscribe(
      () => {
        this.unsubscribeSuccessful = true;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }
}
