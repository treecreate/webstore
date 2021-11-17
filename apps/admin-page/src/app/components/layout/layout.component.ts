import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'webstore-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
   @Input() username = 'example@looking.good';

  constructor(private router: Router) {
  }

  changeRoute() {
    if (this.router.url === '/dashboard') {
      return 'dashboard';
    } else if (this.router.url === '/orders') {
      return 'orders';
    } else if (this.router.url === '/customers') {
      return 'customers';
    } else if (this.router.url === '/discounts') {
      return 'discounts';
    } else if (this.router.url === '/activity-log') {
      return 'activity-log';
    } else if (this.router.url === '/newsletter') {
      return 'newsletter';
    } else if (this.router.url === '/account') {
      return 'account';
    } else if (this.router.url === '/logout') {
      return 'logout';
    } else {
      return 'not-found';
    }
  }
}
