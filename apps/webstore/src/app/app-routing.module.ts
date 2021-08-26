import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoles } from '@models';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';
import { RejectedCookiesComponent } from './pages/issues/rejected-cookies/rejected-cookies.component';
import { ProfileComponent } from './pages/auth/profile/profile.component';
import { AuthGuard } from './shared/guards/auth/auth.guard';
import { ProductComponent } from './pages/product/product.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { CookieGuard } from './shared/guards/cookie-guard/cookie.guard';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { CollectionComponent } from './pages/auth/collection/collection.component';
import { VerificationComponent } from './pages/auth/verification/verification.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { NotSignedInComponent } from './pages/product/not-signed-in/not-signed-in.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [CookieGuard] }, // CookieGuard ensures that the user has accepted cookies
  { path: 'login', component: LoginComponent, canActivate: [CookieGuard] },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent,
    canActivate: [CookieGuard],
  },
  {
    path: 'verification/:token',
    component: VerificationComponent,
    canActivate: [CookieGuard],
  },
  { path: 'signup', component: SignupComponent, canActivate: [CookieGuard] },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.user] },
  },
  {
    path: 'collection',
    component: CollectionComponent,
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.user] },
  },
  { path: 'product', component: ProductComponent, canActivate: [CookieGuard] },
  {
    path: 'notSignedIn',
    component: NotSignedInComponent,
    canActivate: [CookieGuard],
  },
  { path: 'paymentSuccess', component: PaymentSuccessComponent },
  { path: 'rejectedCookies', component: RejectedCookiesComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' }, // Redirect to home page
  { path: '**', component: PageNotFoundComponent }, // PageNotFound for all other page requests
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
