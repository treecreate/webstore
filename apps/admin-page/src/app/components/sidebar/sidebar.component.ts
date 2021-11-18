import { Component, Input } from '@angular/core';

@Component({
  selector: 'webstore-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() username = 'defaultValue@sidebar.component';

  public items = [
    {
      route: 'dashboard',
      nzIcon: 'qrcode',
      name: 'Dashboard',
    },
    {
      route: 'orders',
      nzIcon: 'shopping-cart',
      name: 'Orders',
    },
    {
      route: 'customers',
      nzIcon: 'user',
      name: 'Customers',
    },
    {
      route: 'discounts',
      nzIcon: 'credit-card',
      name: 'Discounts',
    },
    {
      route: 'activity-log',
      nzIcon: 'line-chart',
      name: 'Activity Log',
    },
    {
      route: 'newsletter',
      nzIcon: 'mail',
      name: 'Newsletter',
    },
  ];

  constructor() {}
}
