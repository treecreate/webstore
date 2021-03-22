import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

// COMPONENTS
import { AppComponent } from './app.component';
import { GoogleAnalyticsService } from './services/google-analytics/google-analytics.service';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';

// PAGES
import { HomeComponent } from './public/home/home.component';
import { ProductComponent } from './public/product/product.component';
import { BasketComponent } from './public/basket/basket.component';
import { PageNotFoundComponent } from './public/issue-pages/page-not-found/page-not-found.component';
import { ProfileComponent } from './public/profile/profile.component';
import { AboutUsComponent } from './public/about-us/about-us.component';
import { PrivacyNoticeComponent } from './public/terms-and-conditions/privacy-notice/privacy-notice.component';
import { TermsOfPaymentComponent } from './public/terms-and-conditions/terms-of-payment/terms-of-payment.component';
import { AppRoutingModule } from './app-routing.module';
import { ErrorComponent } from './public/issue-pages/error/error.component';
import { ResetPasswordComponent } from './public/issue-pages/reset-password/reset-password.component';
import { IntroductionComponent } from './public/product/introduction/introduction.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    ProductComponent,
    BasketComponent,
    PageNotFoundComponent,
    ProfileComponent,
    AboutUsComponent,
    PrivacyNoticeComponent,
    TermsOfPaymentComponent,
    ErrorComponent,
    ResetPasswordComponent,
    IntroductionComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, MDBBootstrapModule.forRoot()],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent],
  exports: [IntroductionComponent],
})
export class AppModule {}
