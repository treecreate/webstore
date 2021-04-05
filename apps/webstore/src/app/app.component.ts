import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';

import { BehaviorSubject } from 'rxjs';

//Google analytics
declare let gtag: Function;

@Component({
  selector: 'webstore-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'webstore';
  cookies$: BehaviorSubject<Boolean>;

  constructor(public router: Router) {
    //Google analytics
    //Connect the router service to google analytics
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', environment.gtag, {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }
}
