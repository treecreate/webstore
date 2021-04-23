/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'webstore-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.less'],
})
export class ForgotComponent implements OnInit {
  form: FormGroup;
  submitting = false;
  success = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {}



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
      const response = await this.authService.passwordResetRequest({
        email: this.email.value,
      });
      if (response.submitted) {
        this.success = true;
      }
      this.submitting = false;
    } catch (error) {
      // Show success block regardless
      this.success = true;
      this.submitting = false;
      throw Error(error);
    }
  }

  // === Getters ===
  get email() {
    return this.form.get('email');
  }

  get isFormValid(): boolean {
    return this.form.dirty && this.form.valid;
  }
}
