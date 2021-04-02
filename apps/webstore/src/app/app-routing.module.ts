import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' }, // Redirect to home page
  { path: 'home', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent }, // PageNotFound for all other page requests !! MUST BE LAST IN ROUTER OBJ !!
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
