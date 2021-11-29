import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ILoginResponse } from '@interfaces';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'webstore-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  loginForm: FormGroup;

  constructor(private authService: AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  submitLogin() {
    this.isLoading = true;
    // TODO: add login functionality
    if (this.loginForm.valid) {
      this.authService
        .login({
          email: this.loginForm.get('email')?.value,
          password: this.loginForm.get('password')?.value,
        })
        .subscribe(
          (data: ILoginResponse) => {
            this.authService.saveAuthUser(data);
            //TODO: add login alert
            this.isLoading = false;
          },
          (err) => {
            console.error(err.error);
            //TODO: add login failed alert
          }
        );
    }
  }
}
