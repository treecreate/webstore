import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAuthUser, INewsletter } from '@interfaces';
import { LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/authentication/auth.service';
import { LocalStorageService } from '../../services/local-storage';
import { NewsletterService } from '../../services/order/newsletter/newsletter.service';
import { PrivacyNoticeModalComponent } from '../modals/privacy-notice-modal/privacy-notice-modal.component';
import { TermsOfSaleModalComponent } from '../modals/terms-of-sale-modal/terms-of-sale-modal.component';
import { TermsOfUseModalComponent } from '../modals/terms-of-use-modal/terms-of-use-modal.component';
import { ToastService } from '../toast/toast-service';

@Component({
  selector: 'webstore-footer',
  templateUrl: './footer.component.html',
  styleUrls: [
    './footer.component.css',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class FooterComponent implements OnInit {
  public isLoggedIn: boolean;
  private authUser$: BehaviorSubject<IAuthUser>;
  public currentYear = new Date().getFullYear();
  signupNewsletterForm: FormGroup;
  isLoading = false;

  constructor(
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private newsletterService: NewsletterService,
    private toastService: ToastService
  ) {
    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(
      LocalStorageVars.authUser
    );
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn =
        this.authUser$.getValue() != null &&
        this.authService.isAccessTokenValid();
    });
  }

  ngOnInit(): void {
    this.signupNewsletterForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  submit() {
    this.isLoading = true;
    this.newsletterService
      .registerNewsletterEmail(this.signupNewsletterForm.get('email').value)
      .subscribe(
        (newsletterData: INewsletter) => {
          this.toastService.showAlert(
            `Thank you for subscribing: ${newsletterData.email}`,
            `Tak for din tilmelding: ${newsletterData.email}`,
            'success',
            3000
          );
          this.isLoading = false;
        },
        (error) => {
          this.toastService.showAlert(
            error.error.message,
            error.error.message,
            'danger',
            100000
          );
          console.error(error);
          this.isLoading = false;
        }
      );
  }

  showTermsOfUse() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }

  showTermsOfSale() {
    this.modalService.open(TermsOfSaleModalComponent, { size: 'lg' });
  }

  showPrivacyNotice() {
    this.modalService.open(PrivacyNoticeModalComponent, { size: 'lg' });
  }
}
