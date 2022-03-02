import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsletterService } from '../../../services/order/newsletter/newsletter.service';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'webstore-newsletter-signup-modal',
  templateUrl: './newsletter-signup-modal.component.html',
  styleUrls: ['./newsletter-signup-modal.component.scss', '../../../../../assets/styles/tc-input-field.scss'],
})
export class NewsletterSignupModalComponent {
  newsletterSignupModalForm: FormGroup;
  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private newsletterService: NewsletterService,
    private toastService: ToastService
  ) {
    this.newsletterSignupModalForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  submit() {
    const email: string = this.newsletterSignupModalForm.get('email').value;
    if (email) {
      this.isLoading = true;
      this.newsletterService.registerNewsletterEmail(email).subscribe(
        () => {
          this.toastService.showAlert(
            `Thank you for subscribing: ${email}`,
            `Tak for din tilmelding: ${email}`,
            'success',
            3000
          );
          this.isLoading = false;
          this.activeModal.close();
        },
        (err) => {
          this.toastService.showAlert(
            `Failed to subscribe: ${email}. Please try again.`,
            `Der skete en fejl ved tilmelding af: ${email}. Prøv venligst igen.`,
            'danger',
            5000
          );
        }
      );
    } else {
      this.toastService.showAlert(
        `Please write your email and try again.`,
        `Udfyld din email først og prøv venligst igen.`,
        'danger',
        5000
      );
    }
  }
}
