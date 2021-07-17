import { Component, OnInit } from '@angular/core';
import { IRegisterRequestParams, IRegisterResponse } from '@interfaces';
import { AuthService } from '../../shared/services/authentication/auth.service';

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

  constructor(private authService: AuthService) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  onSubmit(): void {
    this.authService.register(this.form).subscribe(
      (data: IRegisterResponse) => {
        console.log('Registration status: ' + data.message);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
