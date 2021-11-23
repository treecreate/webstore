import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { materialModules } from './material.constant';
import { LayoutComponent } from './components/layout/layout.component';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, LayoutComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    materialModules,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    LayoutComponent
  ],
})
export class AppModule {}
