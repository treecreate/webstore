import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

// COMPONENTS
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { GoogleAnalyticsService } from './services/google-analytics/google-analytics.service';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';

// PAGES
import { HomeComponent } from './public/home/home.component';
import { ProductComponent } from './public/product/product.component';
import { BasketComponent } from './public/basket/basket.component';
import { PageNotFoundComponent } from './public/page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutUsComponent } from './about-us/about-us.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    ProductComponent,
    BasketComponent,
    PageNotFoundComponent,
    ProfileComponent,
    AboutUsComponent,
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot(
      [
        { path: 'home', component: HomeComponent },
        { path: 'product', component: ProductComponent },
        { path: 'basket', component: BasketComponent },
        { path: 'aboutUs', component: AboutUsComponent },
        { path: 'profile', component: ProfileComponent },
        { path: '', pathMatch: 'full', redirectTo: 'home' }, // Redirect to home page
        { path: '**', component: PageNotFoundComponent }, // PageNotFound for all other page requests
      ],
      {
        initialNavigation: 'enabled',
      }
    ),
  ],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent],
  exports: [
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    ProductComponent,
    BasketComponent,
    PageNotFoundComponent,
    ProfileComponent,
    AboutUsComponent,
  ],
})
export class AppModule {}
