import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILoginResponse } from '@interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordModalComponent } from '../../../shared/components/modals/forgot-password-modal/forgot-password-modal.component';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { AuthService } from '../../../shared/services/authentication/auth.service';

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

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // if user is already logged in redirect to profile
    if (this.authService.getAuthUser()) {
      this.router.navigate(['/profile']);
    }

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit(): void {
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
            2500
          );

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.router.navigate(['/']);
        },
        (err) => {
          this.toastService.showAlert(
            'Failed to login, please try again.',
            'Fejl ved login, prøv igen.',
            'danger',
            2500
          );
          console.error(err);
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
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
