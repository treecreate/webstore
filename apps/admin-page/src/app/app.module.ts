import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { materialModules } from './material.constant';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ItemCardComponent } from './components/item-card/item-card.component';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { DiscountsComponent } from './pages/discounts/discounts.component';
import { ClipboardModule } from 'ngx-clipboard';
import { AccountComponent } from './pages/account/account.component';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { EditDiscountComponent } from './pages/edit-discount/edit-discount.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
    DashboardComponent,
    OrdersComponent,
    ItemCardComponent,
    DiscountsComponent,
    AccountComponent,
    ChangePasswordDialogComponent,
    EditDiscountComponent,
    OrderDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    materialModules,
    ClipboardModule,
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
