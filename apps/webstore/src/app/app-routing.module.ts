import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';

const routes: Routes = [
  { path: 'landingpage', component: LandingpageComponent }, // canActivate: [CookieGuard] }, // CookieGuard ensures that the user has accepted cookies
  { path: '', pathMatch: 'full', redirectTo: 'landingpage' },
  { path: '**', component: PageNotFoundComponent }, // PageNotFound for all other page requests
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
