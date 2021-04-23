import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';
import { RejectedCookiesComponent } from './pages/issues/rejected-cookies/rejected-cookies.component';
import { CarListComponent } from './shared/components/car-list/car-list.component';
import { CookieGuard } from './shared/guards/cookie-guard/cookie.guard';
import { GoogleAnalyticsService } from './shared/services/google-analytics/google-analytics.service';
import { LoginCallbackComponent } from './pages/login-callback/login-callback.component';
import { OktaAuthGuard } from '@okta/okta-angular';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [CookieGuard] }, // CookieGuard ensures that the user has accepted cookies
  { path: 'rejectedCookies', component: RejectedCookiesComponent, canActivate: [OktaAuthGuard] },
  { path: 'cars', component: CarListComponent, canActivate: [CookieGuard, OktaAuthGuard] },
  {
    path: '',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule),
  }, // Redirect to home page
  { path: 'login/callback', component: LoginCallbackComponent }, // Redirect to home page
  { path: 'profile', component: CarListComponent, canActivate: [CookieGuard, OktaAuthGuard] }, // Redirect to home page
  //{ path: '', pathMatch: 'full', redirectTo: 'home' }, // Redirect to home page
  { path: '**', component: PageNotFoundComponent }, // PageNotFound for all other page requests
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [GoogleAnalyticsService],
  exports: [RouterModule],
})
export class AppRoutingModule {}
