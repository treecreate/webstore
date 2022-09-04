import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ErrorlogPriorityEnum, ILoginResponse, ITransactionItem } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordModalComponent } from '../../../shared/components/modals/forgot-password-modal/forgot-password-modal.component';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { ErrorlogsService } from '../../../shared/services/errorlog/errorlog.service';
import { EventsService } from '../../../shared/services/events/events.service';
import { TransactionItemService } from '../../../shared/services/transaction-item/transaction-item.service';

@Component({
  selector: 'webstore-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../../../assets/styles/tc-input-field.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  @ViewChild('successfulLogin') successfulLogin: ElementRef;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  isLoading = false;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private transactionItemService: TransactionItemService,
    private eventsService: EventsService,
    private errorlogService: ErrorlogsService,
    private metaTitle: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.setMetaData();
    // if user is already logged in redirect to products page
    if (this.authService.isAccessTokenValid()) {
      this.router.navigate(['/products']);
    }

    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', [Validators.required]),
    });
  }

  setMetaData() {
    this.metaTitle.setTitle('Login til Treecreate og bliv en del af fællesskabet');
    this.meta.updateTag({ name: 'description', content: 'Opret flere designs og gem til når det er tid til fødselsdag, jul eller en anden gave højtid.' });
    this.meta.updateTag({ name: 'keywords', content: 'Designs, tid, fødselsdag, jul, højtid, gave, fællesskab, treecreate' });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService
      .login({
        email: this.loginForm.get('email').value,
        password: this.loginForm.get('password').value,
      })
      .subscribe({
        next: (data: ILoginResponse) => {
          this.authService.saveAuthUser(data);

          this.toastService.showAlert(
            'Welcome back! You are now logged in.',
            'Velkommen tilbage! Du er nu logget ind.',
            'success',
            5000
          );
          // Check for transaction items in localstorage and add them to user
          // Get localStorage items
          const localStorageItems = this.localStorageService.getItem<ITransactionItem[]>(
            LocalStorageVars.transactionItems
          ).value;

          this.eventsService.create('webstore.login.logged-in');

          // Create the transaction items in DB / user
          if (localStorageItems !== null) {
            this.transactionItemService
              .createBulkTransactionItem({
                transactionItems: localStorageItems,
              })
              .subscribe({
                next: () => {
                  this.localStorageService.removeItem(LocalStorageVars.transactionItems);

                  this.isLoading = false;
                  this.isLoginFailed = false;
                  this.isLoggedIn = true;
                  this.router.navigate(['/products']);
                  this.reloadPage();
                },
                error: (error: HttpErrorResponse) => {
                  console.error(error.error);
                  this.errorlogService.create(
                    'webstore.login.upload-designs-failed',
                    ErrorlogPriorityEnum.critical, // The users may lose their created designs
                    error
                  );
                  this.isLoading = false;
                  this.isLoginFailed = true;
                  this.errorMessage = error.error.message;
                },
              });
          } else {
            this.isLoading = false;
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.router.navigate(['/products']);
            this.reloadPage();
          }
        },
        error: (err) => {
          this.toastService.showAlert(
            'Failed to login, please try again.',
            'Fejl ved login, prøv igen.',
            'danger',
            5000
          );
          console.error(err);
          this.errorlogService.create('webstore.login.login-failed', ErrorlogPriorityEnum.low, err);
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
          this.isLoading = false;
        },
      });
  }

  openForgotPasswordModal() {
    this.modalService.open(ForgotPasswordModalComponent);
  }

  @HostListener('document:keydown.enter') enterKeyPressed() {
    if (!this.isDisabled()) {
      this.onSubmit();
    }
  }

  isDisabled(): boolean {
    return this.loginForm.get('email').invalid || this.loginForm.get('password').invalid;
  }

  reloadPage(): void {
    window.location.reload();
  }
}
