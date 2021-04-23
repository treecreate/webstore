import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';
import { RejectedCookiesComponent } from './pages/issues/rejected-cookies/rejected-cookies.component';
import { CarListComponent } from './shared/components/car-list/car-list.component';
import { CookieGuard } from './shared/guards/cookie-guard/cookie.guard';
import { GoogleAnalyticsService } from './shared/services/google-analytics/google-analytics.service';
import { LoginComponent } from './pages/login/login.component';
import { LoginCallbackComponent } from './pages/login-callback/login-callback.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [CookieGuard] }, // CookieGuard ensures that the user has accepted cookies
  { path: 'rejectedCookies', component: RejectedCookiesComponent },
  { path: 'cars', component: CarListComponent, canActivate: [CookieGuard] },
  { path: 'login', component: LoginComponent }, // Redirect to home page
  { path: 'login/callback', component: LoginCallbackComponent }, // Redirect to home page
  { path: 'profile', component: CarListComponent, canActivate: [CookieGuard] }, // Redirect to home page
  { path: '', pathMatch: 'full', redirectTo: 'home' }, // Redirect to home page
  { path: '**', component: PageNotFoundComponent }, // PageNotFound for all other page requests
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [GoogleAnalyticsService],
  exports: [RouterModule],
})
export class AppRoutingModule {}
