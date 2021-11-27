import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { materialModules } from './material.constant';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { TempComponent } from './components/temp/temp.component';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent, TempComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, BrowserAnimationsModule, materialModules],
  providers: [],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
