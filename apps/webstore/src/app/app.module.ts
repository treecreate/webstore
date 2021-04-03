import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//Services
import { GoogleAnalyticsService } from './shared/services/google-analytics/google-analytics.service';
//Components
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { CookiePromptModalComponent } from './shared/components/modals/cookie-prompt-modal/cookie-prompt-modal.component';
import { TermsOfUseModalComponent } from './shared/components/modals/terms-of-use-modal/terms-of-use-modal.component';
import { PrivacyNoticeModalComponent } from './shared/components/modals/privacy-notice-modal/privacy-notice-modal.component';
import { TermsOfSaleModalComponent } from './shared/components/modals/terms-of-sale-modal/terms-of-sale-modal.component';
import { ParallaxDirective } from './shared/directives/parallax/parallax.directive';
//Pages
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    CookiePromptModalComponent,
    PrivacyNoticeModalComponent,
    TermsOfUseModalComponent,
    TermsOfSaleModalComponent
  ],
  imports: [BrowserModule, AppRoutingModule, ParallaxDirective, NgbModule],
  providers: [GoogleAnalyticsService, NgbActiveModal, ParallaxDirective],
  bootstrap: [AppComponent],
})
export class AppModule {}
