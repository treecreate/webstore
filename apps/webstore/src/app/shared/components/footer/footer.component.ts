import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ErrorlogPriorityEnum, IAuthUser, INewsletter } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/authentication/auth.service';
import { ErrorlogsService } from '../../services/errorlog/errorlog.service';
import { EventsService } from '../../services/events/events.service';
import { NewsletterService } from '../../services/newsletter/newsletter.service';
import { PrivacyNoticeModalComponent } from '../modals/privacy-notice-modal/privacy-notice-modal.component';
import { TermsOfSaleModalComponent } from '../modals/terms-of-sale-modal/terms-of-sale-modal.component';
import { TermsOfUseModalComponent } from '../modals/terms-of-use-modal/terms-of-use-modal.component';
import { ToastService } from '../toast/toast-service';

@Component({
  selector: 'webstore-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css', '../../../../assets/styles/tc-input-field.scss'],
})
export class FooterComponent implements OnInit {
  public isLoggedIn: boolean;
  private authUser$: BehaviorSubject<IAuthUser>;
  public currentYear = new Date().getFullYear();
  signupNewsletterForm: UntypedFormGroup;
  isLoading = false;
  @ViewChild('emailInput') emailInput: ElementRef;

  constructor(
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private newsletterService: NewsletterService,
    private toastService: ToastService,
    public eventsService: EventsService,
    private errorlogsService: ErrorlogsService
  ) {
    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn = this.authUser$.getValue() != null && this.authService.isAccessTokenValid();
    });
  }

  ngOnInit(): void {
    this.signupNewsletterForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
    });
  }

  submit() {
    this.isLoading = true;
    if (this.signupNewsletterForm.get('email').value !== '') {
      this.newsletterService.registerNewsletterEmail(this.signupNewsletterForm.get('email').value).subscribe(
        (newsletterData: INewsletter) => {
          this.toastService.showAlert(
            `Thank you for subscribing: ${newsletterData.email}`,
            `Tak for din tilmelding: ${newsletterData.email}`,
            'success',
            3000
          );
          this.isLoading = false;
          this.eventsService.create('webstore.footer.newsletter-signup');
        },
        (error) => {
          console.error(error);
          this.errorlogsService.create('webstore.footer.newsletter-signup-failed', ErrorlogPriorityEnum.high, error);
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

  showTermsOfUse() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }

  showTermsOfSale() {
    this.modalService.open(TermsOfSaleModalComponent, { size: 'lg' });
  }

  showPrivacyNotice() {
    this.modalService.open(PrivacyNoticeModalComponent, { size: 'lg' });
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
