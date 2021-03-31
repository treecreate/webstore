import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
//Services
import { GoogleAnalyticsService } from './shared/services/google-analytics/google-analytics.service';
//Components
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent],
  exports: [HomeComponent, PageNotFoundComponent],
})
export class AppModule {}
