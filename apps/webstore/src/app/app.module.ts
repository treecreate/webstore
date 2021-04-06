import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//Services
import { GoogleAnalyticsService } from './shared/services/google-analytics/google-analytics.service';
//Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
//Pages
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { CookiePromptComponent } from './shared/components/cookie-prompt/cookie-prompt.component';
import { TermsOfSaleModalComponent } from './shared/components/modals/terms-of-sale-modal/terms-of-sale-modal.component';
import { TermsOfUseModalComponent } from './shared/components/modals/terms-of-use-modal/terms-of-use-modal.component';
import { PrivacyNoticeModalComponent } from './shared/components/modals/privacy-notice-modal/privacy-notice-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    CookiePromptComponent,
    TermsOfSaleModalComponent,
    TermsOfUseModalComponent,
    PrivacyNoticeModalComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
