import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { LoginDto } from '../../../shared/services/auth/dto/login.dto';

@Component({
  selector: 'webstore-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  // Form state
  submitting = false;
  errorMsg: string;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  // === Lifecycle methods ===
  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  // === Handlers ===
  async submitHandler() {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    const formValue: LoginDto = this.form.value;

    try {
      await this.authService.login(formValue);
      this.submitting = false;
    } catch (error) {
      this.errorMsg = error;
      this.submitting = false;
      throw Error(error);
    }
  }

  // === Getters ===
  get isFormValid(): boolean {
    return this.form.dirty && this.form.valid;
  }
}
