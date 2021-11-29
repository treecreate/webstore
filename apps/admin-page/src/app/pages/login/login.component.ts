import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILoginResponse } from '@interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/authentication/auth.service';
import { UserRoles } from '@models';

@Component({
  selector: 'webstore-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoading = false;
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
    // if user is already logged in redirect to profile
    if (this.authService.getAuthUser()) {
      this.router.navigate(['/dashboard']);
    }
  }

  submitLogin() {
    this.isLoading = true;
    if (this.loginForm.valid) {
      this.authService
        .login({
          email: this.loginForm.get('email')?.value,
          password: this.loginForm.get('password')?.value,
        })
        .subscribe(
          (data: ILoginResponse) => {
            if (data.roles.includes(UserRoles.admin) || data.roles.includes(UserRoles.developer)) {
              this.authService.saveAuthUser(data);
              this.snackBar.open('Welcome back to Treecreate!', 'Thanks', { duration: 2500 });
              this.router.navigate(['/dashboard']);
            } else {
              this.snackBar.open('You dont have authorisation to enter this page', 'Great', { duration: 3500 });
            }
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
