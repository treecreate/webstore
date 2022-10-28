import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoles } from '@models';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { BasketComponent } from './pages/auth/basket/basket.component';
import { CheckoutComponent } from './pages/auth/checkout/checkout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { OrdersComponent } from './pages/auth/orders/orders.component';
import { ProfileComponent } from './pages/auth/profile/profile.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { UnsubscribeComponent } from './pages/auth/unsubscribe/unsubscribe.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';
import { PaymentCancelledComponent } from './pages/payment-cancelled/payment-cancelled.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { CustomOrderComponent } from './pages/products/product-pages/custom-order/custom-order.component';
import { FamilyTreeComponent } from './pages/products/product-pages/family-tree/family-tree.component';
import { QuotableComponent } from './pages/products/product-pages/quotable/quotable.component';
import { ProductsComponent } from './pages/products/products.component';
import { AuthGuard } from './shared/guards/auth/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'home', redirectTo: '' }, // Handle legacy /home route
  { path: 'about-us', component: AboutUsComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'resetPassword/:token',
    component: ResetPasswordComponent,
  },
  {
    path: 'newsletter',
    children: [
      {
        path: 'unsubscribe/:newsletterId',
        component: UnsubscribeComponent,
      },
    ],
  },
  { path: 'signup', component: SignupComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.user] },
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.user] },
  },
  { path: 'products', pathMatch: 'full', component: ProductsComponent },
  {
    path: 'products',
    children: [
      { path: 'family-tree', component: FamilyTreeComponent },
      { path: 'custom-order', component: CustomOrderComponent },
      { path: 'quotable', component: QuotableComponent },
    ],
  },
  {
    path: 'payment',
    children: [
      { path: 'success', component: PaymentSuccessComponent },
      { path: 'cancelled', component: PaymentCancelledComponent },
    ],
  },
  {
    path: 'basket',
    component: BasketComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  { path: '404', component: PageNotFoundComponent }, // PageNotFound for all other page requests
  { path: '**', redirectTo: '404' }, // Redirect unmatched requests to page not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
