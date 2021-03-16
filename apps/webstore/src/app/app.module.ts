import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { GoogleAnalyticsService } from './services/google-analytics/google-analytics.service';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [AppComponent, FooterComponent],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot([], {
      initialNavigation: 'enabled',
    }),
  ],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent],
  exports: [FooterComponent],
})
export class AppModule {}
