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
    console.log(
      this.changePasswordForm.get('password').value,
      this.changePasswordForm.get('confirmPassword').value
    );
  }
}
