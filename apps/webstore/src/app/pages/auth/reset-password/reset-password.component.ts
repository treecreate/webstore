import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor() {}

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-zd].{8,}'),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  isDisabled(): boolean {
    if (
      this.changePasswordForm.get('password').invalid ||
      this.changePasswordForm.get('confirmPassword').invalid ||
      !this.matchingPasswords()
    ) {
      return true;
    } else {
      return false;
    }
  }

  matchingPasswords(): boolean {
    if (
      this.changePasswordForm.get('password').value ===
      this.changePasswordForm.get('confirmPassword').value
    ) {
      return true;
    } else {
      return false;
    }
  }

  onChangePassword() {
    console.log(
      this.changePasswordForm.get('password').value,
      this.changePasswordForm.get('confirmPassword').value
    );
  }
}
