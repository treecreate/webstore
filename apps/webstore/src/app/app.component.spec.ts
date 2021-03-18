import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutUsComponent } from './public/about-us/about-us.component';
import { BasketComponent } from './public/basket/basket.component';
import { ErrorComponent } from './public/error/error.component';
import { HomeComponent } from './public/home/home.component';
import { PageNotFoundComponent } from './public/page-not-found/page-not-found.component';
import { PrivacyNoticeComponent } from './public/privacy-notice/privacy-notice.component';
import { ProductComponent } from './public/product/product.component';
import { ProfileComponent } from './public/profile/profile.component';
import { TermsOfPaymentComponent } from './public/terms-of-payment/terms-of-payment.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
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

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to webstore!'
    );
  });
});
