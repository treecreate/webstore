import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// PAGES
import { HomeComponent } from './public/home/home.component';
import { ProductComponent } from './public/product/product.component';
import { BasketComponent } from './public/basket/basket.component';
import { PageNotFoundComponent } from './public/page-not-found/page-not-found.component';
import { ProfileComponent } from './public/profile/profile.component';
import { AboutUsComponent } from './public/about-us/about-us.component';
import { PrivacyNoticeComponent } from './public/privacy-notice/privacy-notice.component';
import { TermsOfPaymentComponent } from './public/terms-of-payment/terms-of-payment.component';
import { ErrorComponent } from './public/error/error.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'product', component: ProductComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'aboutUs', component: AboutUsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'termsOfPayment', component: TermsOfPaymentComponent },
  { path: 'privacyNotice', component: PrivacyNoticeComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' }, // Redirect to home page
  { path: '**', component: PageNotFoundComponent }, // PageNotFound for all other page requests
  { path: 'error', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
