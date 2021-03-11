import { getHtmlTagDefinition } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

//Google analytics
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
        gtag('config', 'G-4VY53TX2KS', {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }

  title = 'webstore';
}
