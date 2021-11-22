import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocaleType, LocalStorageVars } from '@models';
import { environment } from '../environments/environment';
import { LocalStorageService } from '@local-storage';

// Google analytics-specific syntax
// eslint-disable-next-line @typescript-eslint/ban-types
declare let gtag: Function;

@Component({
  selector: 'webstore-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Treecreate';

  constructor(public router: Router, private localStorageService: LocalStorageService) {
    //Google analytics
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        try {
          if (environment.production) {
            gtag('config', environment.gtag, {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              page_path: event.urlAfterRedirects,
            });
          }
        } catch (error) {
          console.error('Failed to log to google analytics', error);
        }
      }
    });

    this.router.events.subscribe(() => {
      const locale = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).getValue();
      // if the website is deployed the url has locale in it and has to be adjusted to match local storage
      if (window.location.href.includes('/en-US/') && locale === LocaleType.dk) {
        window.location.href = window.location.href.replace('en-US', 'dk');
      } else if (window.location.href.includes('/dk/') && locale === LocaleType.en) {
        window.location.href = window.location.href.replace('dk', 'en-US');
      }
    });
  }
}
