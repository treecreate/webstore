import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoles } from '@models';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.developer, UserRoles.admin] },
    component: DashboardComponent,
  }, // AuthGuard ensures that only authorized users can view this route
  {
    path: 'orders',
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.developer, UserRoles.admin] },
    component: OrdersComponent,
  }, // Orders management page
  { path: '404', component: PageNotFoundComponent }, // PageNotFound for all other page requests
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' }, // Redirect to dashboard page
  { path: '**', redirectTo: '404' }, // PageNotFound for all other page requests
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
