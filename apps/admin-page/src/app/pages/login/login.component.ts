import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ILoginResponse } from '@interfaces';
import { UserRoles } from '@models';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'webstore-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoading = false;
  loginForm: FormGroup;

  /**
   * Initiates login form and checks if user is authentikated.
   *
   * @param authService
   * @param router
   * @param snackBar
   */
  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.minLength(8), Validators.required]),
    });
    // if user is already logged in redirect to profile
    if (this.authService.getAuthUser()) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Checks if form is valid.
   *
   * @returns boolean
   */
  isDisabled(): boolean {
    return !this.loginForm.valid;
  }

  /**
   * Sends a request to the api with email and password to log the user in. \
   * If the user is accepted, it is saved to localstorage with token.
   */
  submitLogin(): void {
    this.isLoading = true;
    if (this.loginForm.valid) {
      this.authService
        .login({
          email: this.loginForm.get('email')?.value,
          password: this.loginForm.get('password')?.value,
        })
        .subscribe(
          (data: ILoginResponse) => {
            if (
              data.roles.some((role) => role.name === UserRoles.developer) ||
              data.roles.some((role) => role.name === UserRoles.admin)
            ) {
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
            this.snackBar.open('Login failed! ' + err.error.message, 'WooptiDo');
            this.isLoading = false;
          }
        );
    } else {
      this.snackBar.open('Invalid Credentials', 'Damn', { duration: 2500 });
      this.isLoading = false;
    }
  }
}
