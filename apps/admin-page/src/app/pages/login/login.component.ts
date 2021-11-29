import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILoginResponse } from '@interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'webstore-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
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
            this.snackBar.open('Welcome back to Treecreate!', 'Thanks', { duration: 2500 });
            this.router.navigate(['/dashboard']);
            this.isLoading = false;
          },
          (err) => {
            console.error(err.error);
            this.snackBar.open('Login failed! ' + err.error.message, 'Fuck');
            this.isLoading = false;
          }
        );
    } else {
      this.snackBar.open('Invalid form', 'Try again', { duration: 2500 });
      this.isLoading = false;
    }
  }
}
