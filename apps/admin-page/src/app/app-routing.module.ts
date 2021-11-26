import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TempComponent } from './components/temp/temp.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'home',
    component: TempComponent,
    // canActivate: [AuthGuard],
    // data: { roles: [UserRoles.developer, UserRoles.admin] },
  }, // AuthGuard ensures that only authorized users can view this route
  { path: '404', component: PageNotFoundComponent }, // PageNotFound for all other page requests
  { path: '', pathMatch: 'full', redirectTo: 'home' }, // Redirect to home page
  { path: 'orders', component: OrdersComponent }, // Orders management page
  { path: '**', component: PageNotFoundComponent }, // PageNotFound for all other page requests
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
