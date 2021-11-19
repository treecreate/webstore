import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { nzModules } from './nz-modules.constant';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { authInterceptorProviders } from './shared/helpers/auth.interceptor';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, BrowserAnimationsModule, nzModules],
  providers: [{ provide: NZ_I18N, useValue: en_US }, authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
