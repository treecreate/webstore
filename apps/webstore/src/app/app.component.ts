import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import {
  LocalStorageService,
  LocalStorageVars,
} from './shared/services/local-storage';

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

  constructor(
    public router: Router,
    private localStorageService: LocalStorageService
  ) {
    //Google analytics
    //Connect the router service to google analytics
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', environment.gtag, {
          page_path: event.urlAfterRedirects,
        });
      }
    });

    this.cookies$ = this.localStorageService.getItem<Boolean>(
      LocalStorageVars.cookies
    );
  }
}
