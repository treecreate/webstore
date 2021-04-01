import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//Services
import { GoogleAnalyticsService } from './shared/services/google-analytics/google-analytics.service';
//Components
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { CookiePromptModalComponent } from './shared/components/cookie-prompt-modal/cookie-prompt-modal.component';
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
    CookiePromptModalComponent
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule],
  providers: [GoogleAnalyticsService, NgbActiveModal],
  bootstrap: [AppComponent],
})
export class AppModule {}
