import { Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ErrorlogPriorityEnum, INewsletter } from '@interfaces';
import { ToastService } from '../../shared/components/toast/toast-service';
import { ErrorlogsService } from '../../shared/services/errorlog/errorlog.service';
import { EventsService } from '../../shared/services/events/events.service';
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
  @ViewChild('emailInput') emailInput: ElementRef;

  constructor(
    private newsletterService: NewsletterService,
    private toastService: ToastService,
    private eventsService: EventsService,
    private errorlogsService: ErrorlogsService
  ) {
    this.newsletterForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
    });
  }

  registerNewsletter(): void {
    this.isLoading = true;
    if (this.newsletterForm.get('email').value !== '') {
      this.newsletterService.registerNewsletterEmail(this.newsletterForm.get('email').value).subscribe(
        (newsletterData: INewsletter) => {
          this.toastService.showAlert(
            `Thank you for subscribing: ${newsletterData.email}`,
            `Tak for din tilmelding: ${newsletterData.email}`,
            'success',
            3000
          );
          this.isLoading = false;
          this.eventsService.create('webstore.about-us.newsletter-signup');
        },
        (error) => {
          console.error(error);
          this.errorlogsService.create('webstore.about-us.newsletter-signup-failed', ErrorlogPriorityEnum.high, error);
          this.toastService.showAlert('Invalid email', 'Ugyldig email', 'danger', 5000);
          this.isLoading = false;
        }
      );
    } else {
      this.toastService.showAlert('Missing email input.', 'Udfyld email feltet.', 'danger', 5000);
      this.emailInput.nativeElement.focus();
      this.isLoading = false;
    }
  }

  isNewsletterReadyForSignup(): boolean {
    return this.newsletterForm.dirty && this.newsletterForm.valid && !this.isLoading;
  }
}
