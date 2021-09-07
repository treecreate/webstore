import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { INewsletter } from '@interfaces';
import { ToastService } from '../../shared/components/toast/toast-service';
import { NewsletterService } from '../../shared/services/newsletter/newsletter.service';

@Component({
  selector: 'webstore-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: [
    './landingpage.component.css',
    '../../../assets/styles/tc-input-field.scss',
  ],
})
export class LandingpageComponent implements OnInit {
  isNewsletterSignupLoading = false;

  newsletterForm: FormGroup;

  constructor(
    private newsletterService: NewsletterService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.newsletterForm = new FormGroup({
      newsletterEmail: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  onNewsletterSignup(): void {
    this.isNewsletterSignupLoading = true;

    this.newsletterService
      .registerNewsletterEmail(this.newsletterForm.get('newsletterEmail').value)
      .subscribe(
        (data: INewsletter) => {
          // TODO: make a danish version
          this.toastService.showAlert(
            `You've been successfully signed up as ${data.email}`,
            `No sproge dansk,${data.email}`,
            'success',
            2500
          );

          this.isNewsletterSignupLoading = false;
        },
        (error) => {
          // TODO: translate API errors to danish
          this.toastService.showAlert(
            error.error.message,
            error.error.message,
            'danger',
            100000
          );
          console.error(error);
          this.isNewsletterSignupLoading = false;
        }
      );
  }

  isValidEmail(): boolean {
    return this.newsletterForm.get('newsletterEmail').invalid;
  }
}
