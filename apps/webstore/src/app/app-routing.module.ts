import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';
import { RejectedCookiesComponent } from './pages/issues/rejected-cookies/rejected-cookies.component';
import { ProductComponent } from './pages/product/product.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { CookieGuard } from './shared/guards/cookie-guard/cookie.guard';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [CookieGuard] }, // CookieGuard ensures that the user has accepted cookies
  { path: 'product', component: ProductComponent, canActivate: [CookieGuard] },
  { path: 'rejectedCookies', component: RejectedCookiesComponent },
  { path: 'signup', component: SignupComponent, canActivate: [CookieGuard] },
  { path: 'login', component: LoginComponent, canActivate: [CookieGuard] },
  { path: 'resetPassword', component: ResetPasswordComponent, canActivate: [CookieGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'home' }, // Redirect to home page
  { path: '**', component: PageNotFoundComponent }, // PageNotFound for all other page requests
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
