import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { UserService } from '../../shared/services/user/user.service';
import { ILoginRequestParams, ILoginResponse } from '@interfaces';
//import { AuthService } from '../_services/auth.service';
//import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'webstore-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: ILoginRequestParams = {
    username: null,
    password: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.authService.getAuthToken()) {
      this.isLoggedIn = true;
      this.roles = this.userService.getUser().roles;
    }
  }

  onSubmit(): void {
    this.authService.login(this.form).subscribe(
      (data: ILoginResponse) => {
        this.authService.saveAuthToken(data.accessToken);
        this.userService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.userService.getUser().roles;
        this.reloadPage();
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
