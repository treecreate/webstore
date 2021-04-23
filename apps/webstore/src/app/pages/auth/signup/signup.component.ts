import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'webstore-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less'],
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  success = false;
  submitting = false;
  resendCounter = 0;
  errorMsg: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  // === Lifecycle methods ===
  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  // === Handlers ===
  async submitHandler() {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;

    try {
      const response = await this.authService.signupRequest({
        email: this.email.value,
      });
      if (response.submitted) {
        this.success = true;
      }
      this.submitting = false;
    } catch (error) {
      this.errorMsg = error.error.message;
      this.submitting = false;
      throw Error(error);
    }
  }

  resendHandler() {
    this.resendCounter++;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { resend: this.resendCounter },
      replaceUrl: true,
    });

    this.submitHandler();
  }

  // === Getters ===
  get email() {
    return this.form.get('email');
  }

  get isFormValid(): boolean {
    return this.form.dirty && this.form.valid;
  }
}
