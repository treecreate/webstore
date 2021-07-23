import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRegisterRequestParams, IRegisterResponse, IUser } from '@interfaces';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'webstore-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: IRegisterRequestParams = {
    email: null,
    password: null,
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  onSubmit(): void {
    this.authService.register(this.form).subscribe(
      (data: IRegisterResponse) => {
        console.log('Registration successful');
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.authService.saveAuthToken(data.accessToken);
        this.userService.saveUser(data);
        this.router.navigate(['/profile']);
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
