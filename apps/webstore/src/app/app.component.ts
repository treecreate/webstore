/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ErrorlogPriorityEnum } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { CookieStatus, LocaleType, LocalStorageVars } from '@models';
import { environment } from '../environments/environment';
import { ErrorlogsService } from './shared/services/errorlog/errorlog.service';

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
  showCookiePrompt = false;

  constructor(
    public router: Router,
    private localStorageService: LocalStorageService,
    private errorlogsService: ErrorlogsService
  ) {
    // Setup localization language
    this.router.events.subscribe(async () => {
      this.updateLocale();
    });
    this.localStorageService.getItem(LocalStorageVars.locale).subscribe(async () => {
      this.updateLocale();
    });

    // Third party cookies and tracking
    // Trigger the cookies logic whenever the cookie state changes for the exmple the user accepts them
    this.localStorageService.getItem(LocalStorageVars.cookiesAccepted).subscribe(() => {
      if (this.localStorageService.getItem(LocalStorageVars.cookiesAccepted).getValue() === CookieStatus.accepted) {
        this.initGoogleAnalytics();
        this.initMetaPixel();
      } else {
        console.log('Not logging Google analytics nor Meta Pixel since cookies were not accepted');
      }
    });

    // Let prerender.io know the website has loaded and it can cached
    setTimeout(() => {
      window['prerenderReady'] = true;
      document.getElementById('prerenderScriptTag').innerHTML = 'window.prerenderReady = true';
    }, 5000);

    setTimeout(() => {
      this.showCookiePrompt = true;
    }, 2000);
  }

  /**
   * Update the url locale information to match users preference (stored in local storage)
   * @returns
   */
  updateLocale() {
    const locale = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).getValue();
    // Don't apply url lang path param logic on localhost aka local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return;
    }
    // if the website is deployed the url has locale in it and has to be adjusted to match local storage
    if (window.location.href.includes('/en-US') && locale === LocaleType.da) {
      // English locale while the user has selected Danish
      console.warn('Redirecting you to your chosen locale: DA');
      window.location.href = window.location.href.replace('/en-US', '');
    } else if (!window.location.href.includes('/en-US') && locale === LocaleType.en) {
      // Danish locale while the user has selected English
      console.warn('Redirecting you to your chosen locale: en-US');
      window.location.href = window.location.origin + '/en-US' + window.location.pathname + window.location.search;
    } else if (window.location.href.includes('/da')) {
      // Legacy URL
      console.warn('Redirecting you to our updated locale');
      window.location.href = window.location.href.replace('/da', '');
    } else if (window.location.href.includes('/dk')) {
      // Legacy URL
      console.warn('Redirecting you to our updated locale');
      window.location.href = window.location.href.replace('/dk', '');
    }
  }

  initGoogleAnalytics() {
    // Could use environment.gtag as well but am lazy so it is hardcoded
    let gtagId;
    if (environment.production) {
      gtagId = 'UA-182084333-1';
    } else {
      gtagId = 'G-6JPBPKQ47M';
    }

    // Add the google analytics script to the index.html, enabling sending of ddata
    const customGtagScriptEle: HTMLScriptElement = document.createElement('script');
    customGtagScriptEle.async = true;
    customGtagScriptEle.src = 'https://www.googletagmanager.com/gtag/js?id=' + gtagId;
    document.head.prepend(customGtagScriptEle);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        try {
          gtag('config', gtagId, {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            page_path: event.urlAfterRedirects,
          });
        } catch (error) {
          console.warn('Failed to log to Google Analytics', error);
          this.errorlogsService.create(
            'webstore.google-analytics.page-redirect-event-failed',
            ErrorlogPriorityEnum.low,
            error
          );
        }
      }
    });
  }

  isProductsPage(): boolean {
    return this.router.url.includes('/products/');
  }

  initMetaPixel() {
    let metaPixelId = '4522081454495074';
    if (environment.production) {
      metaPixelId = '4522081454495074';
    } else {
      metaPixelId = '2714892398657269';
    }
    (function (f: any, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions, prefer-spread, prefer-rest-params
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    (window as any).fbq('init', metaPixelId);
    (window as any).fbq('track', 'PageView');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        try {
          (window as any).fbq('track', 'PageView');
        } catch (error) {
          console.warn('Failed to fire Meta Pixel PageView event', error);
          this.errorlogsService.create(
            'webstore.facebook-pixel.page-view-event-failed',
            ErrorlogPriorityEnum.low,
            error
          );
        }
      }
    });
  }
}
