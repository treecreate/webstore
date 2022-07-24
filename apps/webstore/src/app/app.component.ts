/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from '@local-storage';
import { CookieStatus, LocaleType, LocalStorageVars } from '@models';
import { environment } from '../environments/environment';

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
    // Setup localization language
    this.router.events.subscribe(() => {
      const locale = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).getValue();
      // if the website is deployed the url has locale in it and has to be adjusted to match local storage
      if (window.location.href.includes('/en-US/') && locale === LocaleType.dk) {
        window.location.href = window.location.href.replace('/en-US/', '/dk/');
      } else if (window.location.href.includes('/dk/') && locale === LocaleType.en) {
        window.location.href = window.location.href.replace('/dk/', '/en-US/');
      }
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
  }

  initGoogleAnalytics() {
    console.log('Initializing Google Analytics');
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
    console.log('Google Analytics initialized');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        try {
          gtag('config', gtagId, {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            page_path: event.urlAfterRedirects,
          });
          console.log('Google Analytics Page Redirect event fired');
        } catch (error) {
          console.warn('Failed to log to Google Analytics', error);
        }
      }
    });
  }

  initMetaPixel() {
    console.log('Initializing Meta Pixel');
    let metaPixelId = '1050174159116278';
    if (environment.production) {
      metaPixelId = '1050174159116278';
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
    console.log('Meta Pixel initialized');

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        try {
          (window as any).fbq('track', 'PageView');
          console.log('Meta Pixel PageView event fired');
        } catch (error) {
          console.warn('Failed to fire Meta Pixel PageView event', error);
        }
      }
    });
  }
}
