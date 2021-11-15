import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILoginResponse, ITransactionItem } from '@interfaces';
import { LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordModalComponent } from '../../../shared/components/modals/forgot-password-modal/forgot-password-modal.component';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { LocalStorageService } from '../../../shared/services/local-storage';
import { TransactionItemService } from '../../../shared/services/transaction-item/transaction-item.service';

@Component({
  selector: 'webstore-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
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
    private transactionItemService: TransactionItemService
  ) {}

  ngOnInit(): void {
    // if user is already logged in redirect to profile
    if (this.authService.getAuthUser()) {
      this.router.navigate(['/product']);
    }

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService
      .login({
        email: this.loginForm.get('email').value,
        password: this.loginForm.get('password').value,
      })
      .subscribe(
        (data: ILoginResponse) => {
          this.authService.saveAuthUser(data);

          this.toastService.showAlert(
            'Welcome back! You are now logged in.',
            'Velkommen tilbage! Du er nu logget ind.',
            'success',
            5000
          );
          // Check for transaction items in localstorage and add them to user
          // Dont remove them in case user regrets logging in
          // Get localStorage items
          const localStorageItems = this.localStorageService.getItem<
            ITransactionItem[]
          >(LocalStorageVars.transactionItems).value;
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

          this.isLoading = false;
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.router.navigate(['/product']);
          this.reloadPage();
        },
        (err) => {
          this.toastService.showAlert(
            'Failed to login, please try again.',
            'Fejl ved login, prøv igen.',
            'danger',
            5000
          );
          console.error(err);
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
          this.isLoading = false;
        }
      );
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
    return (
      this.loginForm.get('email').invalid ||
      this.loginForm.get('password').invalid
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
