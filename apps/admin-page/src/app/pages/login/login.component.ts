import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  submitLogin() {
    this.isLoading = true;
    if (this.loginForm.valid) {
      console.log(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value);
      this.authService
        .login({
          email: this.loginForm.get('email')?.value,
          password: this.loginForm.get('password')?.value,
        })
        .subscribe(
          (data: ILoginResponse) => {
            console.log('logged in');
            this.authService.saveAuthUser(data);
            //TODO: add login alert
            this.router.navigate(['/dashboard']);
            this.isLoading = false;
          },
          (err) => {
            console.error(err.error);
            //TODO: add login failed alert
            this.isLoading = false;
          }
        );
    }
  }
}
