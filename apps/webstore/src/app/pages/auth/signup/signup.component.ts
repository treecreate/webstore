import { Component, HostListener, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ErrorlogPriorityEnum, INewsletter, IRegisterResponse, ITransactionItem } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsOfUseModalComponent } from '../../../shared/components/modals/terms-of-use-modal/terms-of-use-modal.component';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { ErrorlogsService } from '../../../shared/services/errorlog/errorlog.service';
import { EventsService } from '../../../shared/services/events/events.service';
import { NewsletterService } from '../../../shared/services/newsletter/newsletter.service';
import { TransactionItemService } from '../../../shared/services/transaction-item/transaction-item.service';
@Component({
  selector: 'webstore-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../../../../assets/styles/tc-input-field.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: UntypedFormGroup;
  termsAndConditions = false;
  isSuccessful = false;
  isSignUpFailed = false;
  signUpForNewletter = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private newsletterService: NewsletterService,
    private localStorageService: LocalStorageService,
    private transactionItemService: TransactionItemService,
    private eventsService: EventsService,
    private errorlogsService: ErrorlogsService,
    private metaTitle: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.setMetaData();
    // if user is already logged in redirect to products page
    if (this.authService.getAuthUser()) {
      this.router.navigate(['/products']);
    }

    this.signupForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z0-9$§!"#€%&/()=?`´^*\'@~±≠¶™∞£§“¡]{8,}$'),
      ]),
      confirmPassword: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z0-9$§!"#€%&/()=?`´^*\'@~±≠¶™∞£§“¡]{8,}$'),
      ]),
    });
  }

  setMetaData() {
    this.metaTitle.setTitle('');
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ name: 'keywords', content: '' });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService
      .register({
        email: this.signupForm.get('email').value,
        password: this.signupForm.get('password').value,
      })
      .subscribe(
        (data: IRegisterResponse) => {
          // Subscribe to newsletter
          if (this.signUpForNewletter) {
            this.newsletterService.registerNewsletterEmail(this.signupForm.get('email').value).subscribe({
              next: (newsletterData: INewsletter) => {
                this.toastService.showAlert(
                  `Thank you for subscribing: ${newsletterData.email}`,
                  `Tak for din tilmelding: ${newsletterData.email}`,
                  'success',
                  3000
                );
                this.eventsService.create('webstore.signup.newsletter-signup');
              },
              error: (error) => {
                console.error(error);
                this.toastService.showAlert(error.error.message, error.error.message, 'danger', 100000);
              },
            });
          }
          // Check for transaction items in localstorage and add them to user
          // Dont remove them in case user regrets logging in
          // Get localStorage items
          const localStorageItems = this.localStorageService.getItem<ITransactionItem[]>(
            LocalStorageVars.transactionItems
          ).value;
          // Create the transaction items in DB / user
          if (localStorageItems != null) {
            for (let i = 0; i < localStorageItems.length; i++) {
              this.transactionItemService.createTransactionItem({
                designId: localStorageItems[i].design.designId,
                dimension: localStorageItems[i].dimension,
                quantity: localStorageItems[i].quantity,
              });
            }
          }

          this.toastService.showAlert(
            'Welcome to Treecreate, you have successfully been registered!',
            'Velkommen til Treecreate, du er nu blevet registreret!',
            'success',
            3500
          );
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.isLoading = false;
          this.authService.saveAuthUser(data);
          this.eventsService.create('webstore.signup.signup');
          this.router.navigate(['/products']);
          window.location.reload();
        },
        (err) => {
          this.errorlogsService.create('webstore.signup.signup-failed', ErrorlogPriorityEnum.medium, err);
          this.toastService.showAlert(
            // TODO: make errormessages both danish and english
            err.error.message,
            // this was removed to prompt the user to why it wasnt working.
            // 'Signup failed, please try again.',
            err.error.message,
            'danger',
            5000
          );
          this.isLoading = false;
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        }
      );
  }

  @HostListener('document:keydown.enter') enterKeyPressed() {
    if (!this.isDisabled()) {
      this.onSubmit();
    }
  }

  matchingPasswords(): boolean {
    return this.signupForm.get('password').value === this.signupForm.get('confirmPassword').value;
  }

  isDisabled(): boolean {
    return (
      this.signupForm.get('email').invalid ||
      this.signupForm.get('password').invalid ||
      this.signupForm.get('confirmPassword').invalid ||
      !this.termsAndConditions ||
      !this.matchingPasswords()
    );
  }

  showTermsOfUse() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }
}
