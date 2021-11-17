import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { AppComponent } from './app.component';
import { nzModules } from './nz-modules.constant';
import { LayoutComponent } from './components/layout/layout.component';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, LayoutComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'dashboard'},
      {path: 'orders'},
      {path: 'customers'},
      {path: 'discounts'},
      {path: 'activity-log'},
      {path: 'newsletter'},
      {path: 'account'},
      {path: 'logout'},
    ], { initialNavigation: 'enabled' }),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    nzModules,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
  exports: [
    LayoutComponent
  ],
})
export class AppModule {}
