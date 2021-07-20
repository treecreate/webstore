import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  constructor() {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-zd].{8,}'),
      ]),
    });
  }

  onLogin() {
    console.log(
      this.loginForm.get('email').value,
      this.loginForm.get('password').value
    );
  }

  isDisabled(): boolean {
    if (
      this.loginForm.get('email').invalid ||
      this.loginForm.get('password').invalid
    ) {
      return true;
    } else {
      return false;
    }
  }
}
