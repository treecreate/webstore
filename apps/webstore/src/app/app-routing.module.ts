import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';
import { RejectedCookiesComponent } from './pages/issues/rejected-cookies/rejected-cookies.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'rejectedCookies', component: RejectedCookiesComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' }, // Redirect to home page
  { path: '**', component: PageNotFoundComponent }, // PageNotFound for all other page requests
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
