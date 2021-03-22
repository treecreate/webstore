// main app import
import { AppComponent } from './app.component';

// imported libraries
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

// components
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

// pages
import { AboutUsComponent } from './public/about-us/about-us.component';
import { BasketComponent } from './public/basket/basket.component';
import { ErrorComponent } from './public/issue-pages/error/error.component';
import { HomeComponent } from './public/home/home.component';
import { PageNotFoundComponent } from './public/issue-pages/page-not-found/page-not-found.component';
import { PrivacyNoticeComponent } from './public/terms-and-conditions/privacy-notice/privacy-notice.component';
import { ProductComponent } from './public/product/product.component';
import { ProfileComponent } from './public/profile/profile.component';
import { TermsOfPaymentComponent } from './public/terms-and-conditions/terms-of-payment/terms-of-payment.component';
import { ResetPasswordComponent } from './public/issue-pages/reset-password/reset-password.component';
import { IntroductionComponent } from './public/product/introduction/introduction.component';

// service import
import { GoogleAnalyticsService } from './services/google-analytics/google-analytics.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MDBBootstrapModule],
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
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'webstore'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('webstore');
  });
});
