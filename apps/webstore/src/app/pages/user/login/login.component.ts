import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILoginResponse } from '@interfaces';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { UserService } from '../../../shared/services/user/user.service';

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
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // if user is already logged in redirect to profile
    if (this.authService.getAuthToken()) {
      this.router.navigate(['/profile']);
    }

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-zd].{8,}'),
      ]),
    });
  }

  onSubmit(): void {
    this.authService
      .login({
        email: this.loginForm.get('email').value,
        password: this.loginForm.get('password').value,
      })
      .subscribe(
        (data: ILoginResponse) => {
          this.authService.saveAuthToken(data.accessToken);
          this.userService.saveUser(data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.userService.getUser().roles;
          this.router.navigate(['/profile']);
        },
        (err) => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
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

  reloadPage(): void {
    window.location.reload();
  }
}
