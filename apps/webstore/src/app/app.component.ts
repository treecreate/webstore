import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { CookiePromptModalComponent } from './shared/components/modals/cookie-prompt-modal/cookie-prompt-modal.component';

//Google analytics
declare let gtag: Function;

@Component({
  selector: 'webstore-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'webstore';

  constructor(public router: Router, private modalService: NgbModal) {
    //Google analytics
    //Connect the router service to google analytics
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', environment.gtag, {
          page_path: event.urlAfterRedirects,
        });
      }
    });

    this.modalService.open(CookiePromptModalComponent);
  }
}
