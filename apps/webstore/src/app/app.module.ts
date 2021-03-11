import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { GoogleAnalyticsService } from './google-analytics/google-analytics.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], {
      initialNavigation: 'enabled',
    }),
  ],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
