import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BasketComponent } from './pages/auth/basket/basket.component';
import { CheckoutComponent } from './pages/auth/checkout/checkout.component';
import { CollectionComponent } from './pages/auth/collection/collection.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { OrdersComponent } from './pages/auth/orders/orders.component';
import { ProfileComponent } from './pages/auth/profile/profile.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { UnsubscribeComponent } from './pages/auth/unsubscribe/unsubscribe.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/issues/page-not-found/page-not-found.component';
import { RejectedCookiesComponent } from './pages/issues/rejected-cookies/rejected-cookies.component';
import { PaymentCancelledComponent } from './pages/payment-cancelled/payment-cancelled.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { FamilyTreeComponent } from './pages/catalog/products/family-tree/family-tree.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { InfoPopoverComponent } from './shared/components/info-popover/info-popover.component';
import { BasketItemComponent } from './shared/components/items/basket-item/basket-item.component';
import { FamilyTreeCheckoutItemComponent } from './shared/components/items/family-tree-checkout-item/family-tree-checkout-item.component';
import { FamilyTreeCollectionItemComponent } from './shared/components/items/family-tree-collection-item/family-tree-collection-item.component';
import { OrderItemComponent } from './shared/components/items/order-item/order-item.component';
import { StoretItemComponent } from './shared/components/items/store-item/store-item.component';
import { AddToBasketModalComponent } from './shared/components/modals/add-to-basket-modal/add-to-basket-modal.component';
import { ChangePasswordModalComponent } from './shared/components/modals/change-password-modal/change-password-modal.component';
import { CookiePromptModalComponent } from './shared/components/modals/cookie-prompt-modal/cookie-prompt-modal.component';
import { FamilyTreeIntroModalComponent } from './shared/components/modals/family-tree-intro-modal/family-tree-intro-modal.component';
import { FamilyTreeTemplateModalComponent } from './shared/components/modals/family-tree-template-modal/family-tree-template-modal.component';
import { ForgotPasswordModalComponent } from './shared/components/modals/forgot-password-modal/forgot-password-modal.component';
import { GoToBasketModalComponent } from './shared/components/modals/go-to-basket-modal/go-to-basket-modal.component';
import { NewsletterSignupModalComponent } from './shared/components/modals/newsletter-signup-modal/newsletter-signup-modal.component';
import { PrivacyNoticeModalComponent } from './shared/components/modals/privacy-notice-modal/privacy-notice-modal.component';
import { TermsOfSaleModalComponent } from './shared/components/modals/terms-of-sale-modal/terms-of-sale-modal.component';
import { TermsOfUseModalComponent } from './shared/components/modals/terms-of-use-modal/terms-of-use-modal.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { DraggableBoxComponent } from './shared/components/products/family-tree/draggable-box/draggable-box.component';
import { FamilyTreeDesignComponent } from './shared/components/products/family-tree/family-tree-design/family-tree-design.component';
import { ReviewCarouselComponent } from './shared/components/review-carousel/review-carousel.component';
import { ToastsContainerComponent } from './shared/components/toast/toast-container.component';
import { authInterceptorProviders } from './shared/helpers/auth.interceptor';
import { GoogleAnalyticsService } from './shared/services/google-analytics/google-analytics.service';
import { QuotableComponent } from './pages/catalog/products/quotable/quotable.component';
import { QuotableDesignComponent } from './shared/components/products/quotable-design/quotable-design.component';
import { MiniProductDisplayComponent } from './pages/catalog/mini-product-display/mini-product-display.component';
import { ProductDisplayComponent } from './pages/catalog/product-display/product-display.component';
import { TextFieldModule } from '@angular/cdk/text-field';

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
    FamilyTreeComponent,
    ForgotPasswordModalComponent,
    ResetPasswordComponent,
    CollectionComponent,
    ProfileComponent,
    ToastsContainerComponent,
    FamilyTreeCollectionItemComponent,
    InfoPopoverComponent,
    PaymentSuccessComponent,
    AddToBasketModalComponent,
    BasketComponent,
    BasketItemComponent,
    CheckoutComponent,
    FamilyTreeCheckoutItemComponent,
    FamilyTreeDesignComponent,
    DraggableBoxComponent,
    ReviewCarouselComponent,
    ChangePasswordModalComponent,
    UnsubscribeComponent,
    PaymentCancelledComponent,
    FamilyTreeIntroModalComponent,
    GoToBasketModalComponent,
    OrdersComponent,
    OrderItemComponent,
    NewsletterSignupModalComponent,
    FamilyTreeTemplateModalComponent,
    StoretItemComponent,
    CatalogComponent,
    QuotableComponent,
    QuotableDesignComponent,
    MiniProductDisplayComponent,
    ProductDisplayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSliderModule,
    TextFieldModule,
  ],
  providers: [GoogleAnalyticsService, authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
