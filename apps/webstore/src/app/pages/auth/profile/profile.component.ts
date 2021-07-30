import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser, UpdateUserRequest } from '@interfaces';
import { ToastService } from '../../../shared/components/toast/toast-service';
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

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  // TODO: implement proper profile stuff (tf does that mean? XD - teodor)

  ngOnInit(): void {
    try {
      this.userService.getUser().subscribe((data) => {
        this.currentUser = data;
        console.log(this.currentUser); // NOTE: Temporary printout for development purposes
      });
    } catch (error) {
      console.error(error);
      // TODO: handle failed fetching of the data
    }

    this.accountInfoForm = new FormGroup({
      name: new FormControl('', [
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z ]*$'),
      ]),
      phoneNumber: new FormControl('', [Validators.maxLength(11)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      streetAddress: new FormControl(''),
      streetAddress2: new FormControl(''),
      city: new FormControl(''),
      postcode: new FormControl('', [
        Validators.max(9999),
        Validators.min(555),
        Validators.pattern('^[0-9]*$'),
      ]),
    });

    // TODO: should not be a timer. should run the updateFormValues() after the currentUser has been fetched
    setTimeout(() => {
      this.updateFormValues();
    }, 1000);
  }

  updateFormValues() {
    // to check if the user is changing their email address.
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
    console.log(this.accountInfoForm.get('email').value);
  }

  updateUser() {
    // Failsafe to check that there is a valid email
    if (this.isDisabled()) {
      console.log('You cant update without an email');
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
        console.log('Updating profile: ' + this.oldEmail);
        this.updateUserQuery();
      }
    }
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
    this.updateUserQuery();
    this.resendVerificationEmail();
  }

  resendVerificationEmail() {
    // TODO: add email change logic like verifying your email and sent userVerified = false;
    console.log('New verification email sent');
    this.toastService.showAlert(
      'A new verification e-mail has been sent. Please go to your inbox and click the verification link.',
      'Vi har sendt dig en ny e-mail. Den skal godkendes før du kan foretage køb på hjemmesiden.',
      'success',
      3500
    );
  }

  isDisabled(): boolean {
    return this.accountInfoForm.get('email').invalid;
  }
}
