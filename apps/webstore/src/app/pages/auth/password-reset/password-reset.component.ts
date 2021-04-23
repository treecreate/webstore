import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { passwordValidator } from '../../../shared/validators/password.validator';

@Component({
  selector: 'webstore-reset-password',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.less'],
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  form: FormGroup;
  errorMsg: string;
  validating: boolean;
  isTokenValid: boolean;

  counter = 5;
  interval = null;

  // Form state
  submitting = false;
  success = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  // === Lifecycle methods ===
  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      password: [null, [passwordValidator]],
    });

    // Read token from url
    const token = this.route.snapshot.paramMap.get('token');

    this.validating = true;
    try {
      await this.authService.passwordResetTokenVerify(token);

      this.validating = false;
      this.isTokenValid = true;
    } catch (error) {
      this.isTokenValid = false;
      this.validating = false;
      throw Error(error);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  // === Handlers ===
  async submitHandler() {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;

    // Read token from url
    const token = this.route.snapshot.paramMap.get('token');

    try {
      const response = await this.authService.passwordReset({
        token,
        password: this.password.value,
      });

      if (response.success) {
        this.success = true;
        this.interval = setInterval(() => {
          if (this.counter === 1) {
            this.router.navigate(['/login']);
          }
          this.counter--;
        }, 1000);
      }
    } catch (error) {
      if (error.status === 401) {
        this.errorMsg = 'Invalid or expired token.';
      } else {
        this.errorMsg = 'Server Error.';
      }
      this.submitting = false;
      throw new Error(error);
    }
  }

  // === Getters ===
  get password() {
    return this.form.get('password');
  }

  get isFormValid(): boolean {
    return this.form.dirty && this.form.valid;
  }
}
