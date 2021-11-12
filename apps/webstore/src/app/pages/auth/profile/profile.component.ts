import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAuthUser, IUser } from '@interfaces';
import { LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordModalComponent } from '../../../shared/components/modals/change-password-modal/change-password-modal.component';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { LocalStorageService } from '@local-storage';
import { UserService } from '../../../shared/services/user/user.service';
import { VerifyService } from '../../../shared/services/verify/verify.service';

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
  isUpdatingUserInfo = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private verifyService: VerifyService,
    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private modalService: NgbModal
  ) {
    // Listen to changes to verification status
    this.localStorageService
      .getItem<IAuthUser>(LocalStorageVars.authUser)
      .subscribe(() => {
        //TODO: isVerified is null, the verify service returns null
        this.isVerified = this.verifyService.getIsVerified();
      });
  }

  ngOnInit(): void {
    this.accountInfoForm = new FormGroup({
      name: new FormControl('', [
        Validators.maxLength(50),
        Validators.pattern('^[^0-9]+$'),
      ]),
      phoneNumber: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(11),
        Validators.pattern('^[0-9+]*$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      streetAddress: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(7),
      ]),
      streetAddress2: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
      ]),
      city: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.pattern('^[^0-9]+$'),
      ]),
      postcode: new FormControl('', [
        Validators.max(9999),
        Validators.min(555),
        Validators.pattern('^[0-9]*$'),
      ]),
    });
    try {
      this.isLoading = true;
      this.userService.getUser().subscribe((user: IUser) => {
        this.currentUser = user;
        if (this.isVerified !== user.isVerified) {
          this.verifyService.setIsVerified(user.isVerified);
        }
        this.updateFormValues();
        this.isLoading = false;
      });
    } catch (error) {
      console.error(error);
      // TODO: add an alert on the page, not just a toast message
    }
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

  updateUser(): void {
    this.isUpdatingUserInfo = true;
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
          this.currentUser = data;
          if (this.accountInfoForm.get('email').value !== this.oldEmail) {
            this.resendVerificationEmail();
            this.authService.logout();
            this.toastService.showAlert(
              `You have been logged out because you've updated your email`,
              `Du er bleven logget ud, fordi din e-mail er bleven ændret.`,
              'success',
              5000
            );
          }
          this.isUpdatingUserInfo = false;
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
          this.isUpdatingUserInfo = false;
        }
      );
  }

  resendVerificationEmail() {
    this.isResendVerificationEmailLoading = true;
    this.verifyService.sendVerificationEmail().subscribe(
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

  openChangePasswordModal() {
    this.modalService.open(ChangePasswordModalComponent);
  }
}
