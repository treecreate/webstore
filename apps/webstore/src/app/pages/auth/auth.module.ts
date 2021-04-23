import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { SignupComponent } from './signup/signup.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignupDetailsComponent } from './signup-details/signup-details.component';
// Social buttons
import {
  FacebookButtonComponent,
  GoogleButtonComponent,
  LinkedinButtonComponent,
  AppleButtonComponent,
} from '../../shared/components/social-buttons';
import { LoginCallbackComponent } from './login-callback/login-callback.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const SOCIAL_BUTTONS = [
  FacebookButtonComponent,
  GoogleButtonComponent,
  LinkedinButtonComponent,
  AppleButtonComponent,
];

@NgModule({
  declarations: [
    LoginComponent,
    LoginCallbackComponent,
    ForgotComponent,
    SignupComponent,
    PasswordResetComponent,
    SignupDetailsComponent,
    AuthComponent,
    ...SOCIAL_BUTTONS,
  ],
  imports: [AuthRoutingModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class AuthModule {}
