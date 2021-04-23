import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { SignupDto } from '../../../shared/services/auth/dto/signup.dto';
import { passwordValidator } from '../../../shared/validators/password.validator';

@Component({
  selector: 'webstore-signup-details',
  templateUrl: './signup-details.component.html',
  styleUrls: ['./signup-details.component.less'],
})
export class SignupDetailsComponent implements OnInit {
  form: FormGroup;

  submitting = false;
  validating: boolean;
  isTokenValid: boolean;

  email: string;
  errorMsg: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  // === Lifecycle methods ===
  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      password: [null, [passwordValidator]],
    });

    // Read token from url
    const token = this.route.snapshot.paramMap.get('token');

    this.validating = true;
    try {
      // Request token decoding
      const { email } = await this.authService.signupTokenVerify(token);
      this.form.get('email').setValue(email);
      this.email = email;

      this.validating = false;
      this.isTokenValid = true;
    } catch (error) {
      this.isTokenValid = false;
      this.validating = false;
      throw Error(error);
    }
  }

  // === Handlers ===
  async submitHandler() {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    const formValue: SignupDto = this.form.value;
    formValue.email = this.email;
    formValue.token = this.route.snapshot.paramMap.get('token');

    try {
      const response = await this.authService.signup(formValue);

      if (response) {
        await this.authService.login({
          email: formValue.email,
          password: formValue.password,
        });
      }
    } catch (error) {
      this.errorMsg = error?.error?.message || 'Server connection error.';
      this.submitting = false;
      throw Error(error);
    }
    this.submitting = false;
  }

  // === Getters ===
  get password() {
    return this.form.get('password');
  }

  get isFormValid(): boolean {
    return this.form.dirty && this.form.valid;
  }
}
