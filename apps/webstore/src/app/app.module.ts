import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Services etc
import { GoogleAnalyticsService } from './shared/services/google-analytics/google-analytics.service';
import { authInterceptorProviders } from './shared/helpers/auth.interceptor';
//Components

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { ForgotPasswordModalComponent } from './shared/components/modals/forgot-password-modal/forgot-password-modal.component';
import { CollectionComponent } from './pages/auth/collection/collection.component';
import { ToastsContainerComponent } from './shared/components/toast/toast-container.component';
import { DesignItemComponent } from './shared/components/design-item/design-item.component';

//Pages
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { CookiePromptModalComponent } from './shared/components/modals/cookie-prompt-modal/cookie-prompt-modal.component';
import { TermsOfSaleModalComponent } from './shared/components/modals/terms-of-sale-modal/terms-of-sale-modal.component';
import { TermsOfUseModalComponent } from './shared/components/modals/terms-of-use-modal/terms-of-use-modal.component';
import { PrivacyNoticeModalComponent } from './shared/components/modals/privacy-notice-modal/privacy-notice-modal.component';
import { RejectedCookiesComponent } from './pages/issues/rejected-cookies/rejected-cookies.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { ProfileComponent } from './pages/auth/profile/profile.component';
import { ProductComponent } from './pages/product/product.component';
import { VerificationComponent } from './pages/auth/verification/verification.component';
import { BasketComponent } from './pages/auth/basket/basket.component';
import { BasketItemComponent } from './shared/components/basket-item/basket-item.component';
import { FamilyTreeDesignComponent } from './shared/components/products/family-tree/family-tree-design/family-tree-design.component';
import { DraggableBoxComponent } from './shared/components/products/family-tree/draggable-box/draggable-box.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    PageNotFoundComponent,
    CookiePromptModalComponent,
    TermsOfSaleModalComponent,
    TermsOfUseModalComponent,
    PrivacyNoticeModalComponent,
    RejectedCookiesComponent,
    ProductComponent,
    ForgotPasswordModalComponent,
    ResetPasswordComponent,
    VerificationComponent,
    CollectionComponent,
    ProfileComponent,
    ToastsContainerComponent,
    DesignItemComponent,
    BasketComponent,
    BasketItemComponent,
    FamilyTreeDesignComponent,
    DraggableBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [GoogleAnalyticsService, authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
