import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordModalComponent } from '../../../shared/components/modals/forgot-password-modal/forgot-password-modal.component';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { UserService } from '../../../shared/services/user/user.service';
import { ILoginResponse } from '@interfaces';
import { ToastService } from '../../../shared/components/toast/toast-service';

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
    private userService: UserService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // if user is already logged in redirect to profile
    if (this.authService.getAuthToken()) {
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
          this.authService.saveAuthToken(data.accessToken);
          this.userService.saveAuthUser(data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.userService.getAuthUser().roles;
          // this.showSuccessfulLogin();
          this.router.navigate(['/']);
        },
        (err) => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
  }

  showSuccessfulLogin() {
    this.successfulLogin.nativeElement.classList.remove('alert-hide');
    setTimeout(() => {
      this.successfulLogin.nativeElement.classList.add('alert-hide');
    }, 3000);
  }

  openForgotPasswordModal() {
    this.modalService.open(ForgotPasswordModalComponent);
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
