import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'webstore-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
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

  signupLink() {
    //workaround routerLink not working
    this.router.navigate(['/signup']);
  }
}
