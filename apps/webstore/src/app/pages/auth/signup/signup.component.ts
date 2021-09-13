import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IRegisterResponse } from '@interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsOfUseModalComponent } from '../../../shared/components/modals/terms-of-use-modal/terms-of-use-modal.component';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { UserService } from '../../../shared/services/user/user.service';
@Component({
  selector: 'webstore-signup',
  templateUrl: './signup.component.html',
  styleUrls: [
    './signup.component.css',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  termsAndConditions = false;
  isSuccessful = false;
  isSignUpFailed = false;
  signUpForNewletter = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // if user is already logged in redirect to profile
    if (this.authService.getAuthUser()) {
      this.router.navigate(['/profile']);
    }

    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-zd].{8,}'),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-zd].{8,}'),
      ]),
    });
  }

  // TODO: add user to newsletter when signupForNewsletter is checked
  onSubmit(): void {
    this.isLoading = true;
    this.authService
      .register({
        email: this.signupForm.get('email').value,
        password: this.signupForm.get('password').value,
      })
      .subscribe(
        (data: IRegisterResponse) => {
          this.toastService.showAlert(
            'Welcome to Treecreate, you have successfully been registered!',
            'Velkommen til Treecreate, du er nu bleven registreret!',
            'success',
            3500
          );
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.isLoading = false;
          this.authService.saveAuthUser(data);
          this.router.navigate(['/profile']);
        },
        (err) => {
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
    return (
      this.signupForm.get('password').value ===
      this.signupForm.get('confirmPassword').value
    );
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
