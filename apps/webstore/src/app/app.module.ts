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
import { PageNotFoundComponent } from './public/page-not-found/page-not-found.component';
import { ProfileComponent } from './public/profile/profile.component';
import { AboutUsComponent } from './public/about-us/about-us.component';
import { PrivacyNoticeComponent } from './public/privacy-notice/privacy-notice.component';
import { TermsOfPaymentComponent } from './public/terms-of-payment/terms-of-payment.component';
import { AppRoutingModule } from './app-routing.module';
import { ErrorComponent } from './public/error/error.component';

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
  ],
  imports: [BrowserModule, AppRoutingModule, MDBBootstrapModule.forRoot()],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
