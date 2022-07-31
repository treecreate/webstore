import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from 'ngx-clipboard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { CreateDiscountDialogComponent } from './components/create-discount-dialog/create-discount-dialog.component';
import { ItemCardComponent } from './components/item-card/item-card.component';
import { ViewUserOrdersDialogComponent } from './components/view-user-orders-dialog/view-user-orders-dialog.component';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { materialModules } from './material.constant';
import { AccountComponent } from './pages/account/account.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DiscountsComponent } from './pages/discounts/discounts.component';
import { EditDiscountComponent } from './pages/edit-discount/edit-discount.component';
import { ErrorlogsComponent } from './pages/errorlogs/errorlogs.component';
import { LoginComponent } from './pages/login/login.component';
import { NewslettersComponent } from './pages/newsletters/newsletters.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UsersComponent } from './pages/users/users.component';

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
    UsersComponent,
    NewslettersComponent,
    ViewUserOrdersDialogComponent,
    EditDiscountComponent,
    OrderDetailsComponent,
    CreateDiscountDialogComponent,
    ErrorlogsComponent,
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
