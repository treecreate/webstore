import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GoogleAnalyticsService } from './shared/services/google-analytics/google-analytics.service';
import { authInterceptorProviders } from './shared/helpers/auth.interceptor';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { ForgotPasswordModalComponent } from './shared/components/modals/forgot-password-modal/forgot-password-modal.component';
import { CollectionComponent } from './pages/auth/collection/collection.component';
import { ToastsContainerComponent } from './shared/components/toast/toast-container.component';
import { FamilyTreeCollectionItemComponent } from './shared/components/items/family-tree-collection-item/family-tree-collection-item.component';
import { FamilyTreeCheckoutItemComponent } from './shared/components/items/family-tree-checkout-item/family-tree-checkout-item.component';
import { CookiePromptModalComponent } from './shared/components/modals/cookie-prompt-modal/cookie-prompt-modal.component';
import { TermsOfSaleModalComponent } from './shared/components/modals/terms-of-sale-modal/terms-of-sale-modal.component';
import { TermsOfUseModalComponent } from './shared/components/modals/terms-of-use-modal/terms-of-use-modal.component';
import { PrivacyNoticeModalComponent } from './shared/components/modals/privacy-notice-modal/privacy-notice-modal.component';
import { AddToBasketModalComponent } from './shared/components/modals/add-to-basket-modal/add-to-basket-modal.component';
import { InfoPopoverComponent } from './shared/components/info-popover/info-popover.component';
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { RejectedCookiesComponent } from './pages/issues/rejected-cookies/rejected-cookies.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { ProfileComponent } from './pages/auth/profile/profile.component';
import { ProductComponent } from './pages/product/product.component';
import { VerificationComponent } from './pages/auth/verification/verification.component';
import { BasketComponent } from './pages/auth/basket/basket.component';
import { FamilyTreeBasketItemComponent } from './shared/components/items/family-tree-basket-item/family-tree-basket-item.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { CheckoutComponent } from './pages/auth/checkout/checkout.component';
import { FamilyTreeDesignComponent } from './shared/components/products/family-tree/family-tree-design/family-tree-design.component';
import { DraggableBoxComponent } from './shared/components/products/family-tree/draggable-box/draggable-box.component';
import { ReviewCarouselComponent } from './shared/components/review-carousel/review-carousel.component';
import { ChangePasswordModalComponent } from './shared/components/modals/change-password-modal/change-password-modal.component';
import { UnsubscribeComponent } from './pages/auth/unsubscribe/unsubscribe.component';
import { FamilyTreeMiniatureComponent } from './shared/components/products/family-tree/family-tree-miniature/family-tree-miniature.component';
import { PaymentCancelledComponent } from './pages/payment-cancelled/payment-cancelled.component';
import { FamilyTreeIntroModalComponent } from './shared/components/modals/family-tree-intro-modal/family-tree-intro-modal.component';
import { GoToBasketModalComponent } from './shared/components/modals/go-to-basket-modal/go-to-basket-modal.component';
import { OrdersComponent } from './pages/auth/orders/orders.component';
import { OrderItemComponent } from './shared/components/items/order-item/order-item.component';

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
    FamilyTreeCollectionItemComponent,
    InfoPopoverComponent,
    PaymentSuccessComponent,
    AddToBasketModalComponent,
    BasketComponent,
    FamilyTreeBasketItemComponent,
    CheckoutComponent,
    FamilyTreeCheckoutItemComponent,
    FamilyTreeDesignComponent,
    FamilyTreeMiniatureComponent,
    DraggableBoxComponent,
    ReviewCarouselComponent,
    ChangePasswordModalComponent,
    UnsubscribeComponent,
    PaymentCancelledComponent,
    FamilyTreeIntroModalComponent,
    GoToBasketModalComponent,
    OrdersComponent,
    OrderItemComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [GoogleAnalyticsService, authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
