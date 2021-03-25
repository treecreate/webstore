import { Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { LocaleType } from './i18n';
import { LocalStorageService, LocalStorageVars } from './services/local-storage';

//Google analytics
declare let gtag: Function;

@Component({
  selector: 'webstore-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  currentLocale$: BehaviorSubject<LocaleType>; 
  localeCode;

  localesList = [
    { code: 'en-US', label: 'English' },
    { code: 'dk', label: 'Danish' }
  ];
  title = $localize`webstore`;

  constructor(public router: Router, private localStorageService: LocalStorageService,
     @Inject(DOCUMENT) private document: Document) {

    // get the default/pre-existing locale from the localStorage
    this.currentLocale$ = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale);

    this.localeCode = this.document.location.href.search( "/dk" ) ? LocaleType.en : LocaleType.dk;
    console.log( this.localeCode );

    this.currentLocale$ = this.localStorageService
      .setItem<LocaleType>( LocalStorageVars.locale, this.localeCode );

    // set the class variable to automatically update when the locale changes
    this.currentLocale$.subscribe(() => {
      console.log('Locale got changed: ' + this.currentLocale$.getValue());
    });

    //Google analytics
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-4VY53TX2KS', {
          page_path: event.urlAfterRedirects,
        });
      }
    });

  }
}
