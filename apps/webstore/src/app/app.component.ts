import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
  constructor(public router: Router) {
    //Google analytics
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', environment.gtag, {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }

  title = 'Treecreate';
}
