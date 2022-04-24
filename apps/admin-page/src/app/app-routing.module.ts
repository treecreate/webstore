import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoles } from '@models';
import { AuthGuard } from './auth/auth.guard';
import { AccountComponent } from './pages/account/account.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DiscountsComponent } from './pages/discounts/discounts.component';
import { EditDiscountComponent } from './pages/edit-discount/edit-discount.component';
import { LoginComponent } from './pages/login/login.component';
import { NewslettersComponent } from './pages/newsletters/newsletters.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UsersComponent } from './pages/users/users.component';

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
    path: 'discounts',
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.developer, UserRoles.admin] },
    component: DiscountsComponent,
  }, // Discounts management page
  {
    path: 'discounts/:id',
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.developer, UserRoles.admin] },
    component: EditDiscountComponent,
  }, // Discount edit page
  {
    path: 'orders',
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.developer, UserRoles.admin] },
    component: OrdersComponent,
  }, // Orders management page
  {
    path: 'account',
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.developer, UserRoles.admin] },
    component: AccountComponent,
  },
  {
    path: 'orders/:id',
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.developer, UserRoles.admin] },
    component: OrderDetailsComponent,
  }, // Order details page
  {
    path: 'users',
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.developer, UserRoles.admin] },
    component: UsersComponent,
  },
  {
    path: 'newsletters',
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.developer, UserRoles.admin] },
    component: NewslettersComponent,
  },
  { path: '404', component: PageNotFoundComponent }, // PageNotFound for all other page requests
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' }, // Redirect to dashboard page
  { path: '**', redirectTo: '404' }, // PageNotFound for all other page requests
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
