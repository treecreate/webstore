import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from '@interfaces';
import { LocalStorageVars } from '@models';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { LocalStorageService } from '../../../shared/services/local-storage';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'webstore-profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    './profile.component.css',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class ProfileComponent implements OnInit {
  public isVerified: boolean;

  currentUser: IUser;
  accountInfoForm: FormGroup;
  oldEmail: string;
  isLoading = false;

  isResendVerificationEmailLoading = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService,
    private localStorageService: LocalStorageService
  ) {
    // Listen to changes to verification status
    this.localStorageService
      .getItem<boolean>(LocalStorageVars.isVerified)
      .subscribe(() => {
        this.isVerified = this.authService.getIsVerified();
      });
  }

  ngOnInit(): void {
    try {
      this.isLoading = true;
      this.userService.getUser().subscribe((user: IUser) => {
        this.currentUser = user;
        if (this.isVerified !== user.isVerified) {
          this.authService.setIsVerified(user.isVerified);
        }
        this.updateFormValues();
        this.isLoading = false;
      });
    } catch (error) {
      console.error(error);
      // TODO: handle failed fetching of the data
    }

    this.accountInfoForm = new FormGroup({
      name: new FormControl('', [
        Validators.maxLength(50),
        Validators.pattern("^[a-zA-Z-' ]*$"),
      ]),
      phoneNumber: new FormControl('', [
        Validators.maxLength(11),
        Validators.pattern('^[0-9+]*$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      streetAddress: new FormControl('', [Validators.maxLength(50)]),
      streetAddress2: new FormControl('', [Validators.maxLength(50)]),
      city: new FormControl('', [Validators.maxLength(50)]),
      postcode: new FormControl('', [
        Validators.max(9999),
        Validators.min(555),
        Validators.pattern('^[0-9]*$'),
      ]),
    });
  }

  updateFormValues() {
    this.oldEmail = this.currentUser.email;
    this.accountInfoForm.setValue({
      name: this.currentUser.name,
      phoneNumber: this.currentUser.phoneNumber,
      email: this.currentUser.email,
      streetAddress: this.currentUser.streetAddress,
      streetAddress2: this.currentUser.streetAddress2,
      city: this.currentUser.city,
      postcode: this.currentUser.postcode,
    });
  }

  hasChangedValues() {
    return (
      this.accountInfoForm.get('name').value === this.currentUser.name &&
      this.accountInfoForm.get('phoneNumber').value ===
        this.currentUser.phoneNumber &&
      this.accountInfoForm.get('email').value === this.currentUser.email &&
      this.accountInfoForm.get('streetAddress').value ===
        this.currentUser.streetAddress &&
      this.accountInfoForm.get('streetAddress2').value ===
        this.currentUser.streetAddress2 &&
      this.accountInfoForm.get('city').value === this.currentUser.city &&
      this.accountInfoForm.get('postcode').value === this.currentUser.postcode
    );
  }

  updateUser() {
    // Check if the user has changed any form values
    if (this.hasChangedValues()) {
      this.toastService.showAlert(
        "You haven't changed any values in the form",
        'Du har ikke ændret nogen informationer',
        'danger',
        2500
      );
      return;
    }
    // Failsafe to check that there is a valid email
    if (this.isDisabled()) {
      console.warn('You cant update without an email');
      this.toastService.showAlert(
        "You can't update your account without a valid e-mail.",
        'Du kan desværre ikke opdaterer din profil uden en valid e-mail',
        'danger',
        2500
      );
    } else {
      // request verification if the user has changed their email
      if (this.accountInfoForm.get('email').value !== this.oldEmail) {
        this.resendVerificationEmail();
      }
      // update user info
      this.updateUserQuery();
    }
  }

  updateUserQuery(): void {
    this.userService
      .updateUser({
        name: this.accountInfoForm.get('name').value,
        phoneNumber: this.accountInfoForm.get('phoneNumber').value,
        email: this.accountInfoForm.get('email').value,
        streetAddress: this.accountInfoForm.get('streetAddress').value,
        streetAddress2: this.accountInfoForm.get('streetAddress2').value,
        city: this.accountInfoForm.get('city').value,
        postcode: this.accountInfoForm.get('postcode').value,
      })
      .subscribe(
        (data: IUser) => {
          console.log('User updated');
          this.toastService.showAlert(
            'Your profile has been updated!',
            'Din konto er bleven opdateret!',
            'success',
            2500
          );
          console.log('data logged: ');
          console.log(data);
          this.currentUser = data;
          if (this.accountInfoForm.get('email').value !== this.oldEmail) {
            this.authService.logout();
            // TODO: localize the alert
            this.toastService.showAlert(
              `You have been logged out because you've updated your email`,
              `TODO: make me danish. You have been logged out because you've updated your email`,
              'success',
              5000
            );
          }
        },
        (err) => {
          console.log('Failed to update user');
          this.toastService.showAlert(
            'Something went wrong, please try again.',
            'Noget gik galt, prøv igen',
            'danger',
            2500
          );
          console.log(err.error.message);
        }
      );
  }

  resendVerificationEmail() {
    this.isResendVerificationEmailLoading = true;
    this.authService.sendVerificationEmail().subscribe(
      () => {
        this.toastService.showAlert(
          'A new verification e-mail has been sent. Please go to your inbox and click the verification link.',
          'Vi har sendt dig en ny e-mail. Den skal godkendes før du kan foretage køb på hjemmesiden.',
          'success',
          10000
        );
        this.isResendVerificationEmailLoading = false;
      },
      (err: HttpErrorResponse) => {
        this.toastService.showAlert(
          `Failed to send a verification email. try again later`,
          'Der skete en fejl med din email, prøv venligst igen',
          'danger',
          20000
        );
        console.log(err);
        this.isResendVerificationEmailLoading = false;
      }
    );
  }

  scrollTop() {
    window.scroll(0, 0);
  }

  isDisabled(): boolean {
    return this.accountInfoForm.get('email').invalid;
  }
}
