import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/components/toast/toast-service';

@Component({
  selector: 'webstore-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.css',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class ResetPasswordComponent implements OnInit {
  changePasswordForm: FormGroup;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  isDisabled(): boolean {
    return (
      this.changePasswordForm.get('password').invalid ||
      this.changePasswordForm.get('confirmPassword').invalid ||
      !this.matchingPasswords()
    );
  }

  matchingPasswords(): boolean {
    return (
      this.changePasswordForm.get('password').value ===
      this.changePasswordForm.get('confirmPassword').value
    );
  }

  onChangePassword() {
    // TODO: implement change password
    this.toastService.showAlert(
      'Your password has been reset!',
      'Din kode er bleven ændret!',
      'success',
      2500
    );
    console.log(
      this.changePasswordForm.get('password').value,
      this.changePasswordForm.get('confirmPassword').value
    );
  }
}
