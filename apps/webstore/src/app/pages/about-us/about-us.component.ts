import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NewsletterService } from '../../shared/services/newsletter/newsletter.service';

@Component({
  selector: 'webstore-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent {
  treesPlanted = 120; // TODO - fetch the planted trees from the API
  newsletterForm: UntypedFormGroup;
  isLoading = false;

  constructor(private newsletterService: NewsletterService) {
    this.newsletterForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
    });
  }

  registerNewsletter(): void {
    //TODO - Implement newsletter signup on the about us page
    console.warn('WIP - Newsletter signup on about us page is not implemented yet!');
  }

  isNewsletterReadyForSignup(): boolean {
    return this.newsletterForm.dirty && this.newsletterForm.valid && !this.isLoading;
  }
}
