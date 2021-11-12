import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoles } from '@models';
import { BasketComponent } from './pages/auth/basket/basket.component';
import { CheckoutComponent } from './pages/auth/checkout/checkout.component';
import { CollectionComponent } from './pages/auth/collection/collection.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ProfileComponent } from './pages/auth/profile/profile.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { UnsubscribeComponent } from './pages/auth/unsubscribe/unsubscribe.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';
import { RejectedCookiesComponent } from './pages/issues/rejected-cookies/rejected-cookies.component';
import { PaymentCancelledComponent } from './pages/payment-cancelled/payment-cancelled.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { ProductComponent } from './pages/product/product.component';
import { AuthGuard } from './shared/guards/auth/auth.guard';
import { CookieGuard } from './shared/guards/cookie-guard/cookie.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [CookieGuard] }, // CookieGuard ensures that the user has accepted cookies
  { path: 'login', component: LoginComponent, canActivate: [CookieGuard] },
  {
    path: 'resetPassword/:token',
    component: ResetPasswordComponent,
    canActivate: [CookieGuard],
  },
  {
    path: 'newsletter',
    children: [
      {
        path: 'unsubscribe/:newsletterId',
        component: UnsubscribeComponent,
        canActivate: [CookieGuard],
      },
    ],
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
    path: 'payment',
    children: [
      { path: 'success', component: PaymentSuccessComponent },
      { path: 'cancelled', component: PaymentCancelledComponent },
    ],
  },
  { path: 'rejectedCookies', component: RejectedCookiesComponent },
  {
    path: 'basket',
    component: BasketComponent,
    canActivate: [CookieGuard],
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [CookieGuard, AuthGuard],
    data: { roles: [UserRoles.user] },
  },
  { path: '', pathMatch: 'full', redirectTo: 'home' }, // Redirect to home page
  { path: '**', component: PageNotFoundComponent }, // PageNotFound for all other page requests
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
