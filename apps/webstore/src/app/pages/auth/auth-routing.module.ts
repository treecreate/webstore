import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LoginCallbackComponent } from './login-callback/login-callback.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignupDetailsComponent } from './signup-details/signup-details.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'login/callback',
        component: LoginCallbackComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: 'signup/:token',
        component: SignupDetailsComponent,
      },
      {
        path: 'forgot',
        component: ForgotComponent,
      },
      {
        path: 'password-reset/:token',
        component: PasswordResetComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
