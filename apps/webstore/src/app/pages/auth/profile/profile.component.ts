import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser, UpdateUserRequest } from '@interfaces';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { AuthService } from '../../../shared/services/authentication/auth.service';
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
  currentUser: IUser;
  accountInfoForm: FormGroup;
  isVerified = false;
  oldEmail: string;

  isResendVerificationEmailLoading = true;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    try {
      this.userService.getUser().subscribe((data) => {
        this.currentUser = data;
        this.isVerified = this.currentUser.isVerified;
        this.updateFormValues();
      });
    } catch (error) {
      console.error(error);
      // TODO: handle failed fetching of the data
    }

    //this.isVerified = this.currentUser.isVerified;

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
    // check if the user is changing their email address.
    this.oldEmail = this.currentUser.email;
    // TODO: add a isVerified value to the IUser and set the this.isVerified = this.currentUser.isVerified
    // set all form values after the user has been fetched.
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
        'You havent changed any values in the form',
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
      // Check if the user has changed their email
      if (this.accountInfoForm.get('email').value !== this.oldEmail) {
        // update user info and email
        this.updateUserWithEmailChange();
      } else {
        // update user info
        this.updateUserQuery();
      }
      this.updateCurrentUser();
    }
  }

  updateCurrentUser() {
    this.currentUser.name = this.accountInfoForm.get('name').value;
    this.currentUser.phoneNumber = this.accountInfoForm.get(
      'phoneNumber'
    ).value;
    this.currentUser.email = this.accountInfoForm.get('email').value;
    this.currentUser.streetAddress = this.accountInfoForm.get(
      'streetAddress'
    ).value;
    this.currentUser.streetAddress2 = this.accountInfoForm.get(
      'streetAddress2'
    ).value;
    this.currentUser.city = this.accountInfoForm.get('city').value;
    this.currentUser.postcode = this.accountInfoForm.get('postcode').value;
  }

  updateUserQuery(): void {
    this.userService
      .updateUser({
        name: this.accountInfoForm.get('name').value,
        phoneNumber: this.accountInfoForm.get('phoneNumber').value,
        email: this.oldEmail,
        streetAddress: this.accountInfoForm.get('streetAddress').value,
        streetAddress2: this.accountInfoForm.get('streetAddress2').value,
        city: this.accountInfoForm.get('city').value,
        postcode: this.accountInfoForm.get('postcode').value,
      })
      .subscribe(
        (data: UpdateUserRequest) => {
          console.log('User updated');
          this.toastService.showAlert(
            'Your profile has been updated!',
            'Din konto er bleven opdateret!',
            'success',
            2500
          );
          console.log('data logged: ');
          console.log(data);
          this.userService.updateUser(data);
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

  updateUserWithEmailChange(): void {
    // only update the user if the email veification is sent.
    if (this.resendVerificationEmail()) {
      this.updateUserQuery();
    }
  }

  resendVerificationEmail() {
    this.isResendVerificationEmailLoading = true;
    let isVerificationEmailSent = false;
    this.authService.sendVerificationEmail().subscribe(
      () => {
        this.toastService.showAlert(
          'A new verification e-mail has been sent. Please go to your inbox and click the verification link.',
          'Vi har sendt dig en ny e-mail. Den skal godkendes før du kan foretage køb på hjemmesiden.',
          'success',
          10000
        );
        isVerificationEmailSent = true;
        this.isResendVerificationEmailLoading = false;
      },
      (err: HttpErrorResponse) => {
        this.toastService.showAlert(
          `Failed to send an email. try again later`,
          'Der skete en fejl med din email, prøv venligst igen',
          'danger',
          20000
        );
        isVerificationEmailSent = false;
        this.isResendVerificationEmailLoading = false;
      }
    );
    return isVerificationEmailSent;
  }

  scrollTop() {
    window.scroll(0, 0);
  }

  isDisabled(): boolean {
    return this.accountInfoForm.get('email').invalid;
  }
}
