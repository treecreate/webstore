import { Component, Input } from '@angular/core';

@Component({
  selector: 'webstore-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css']
})
export class SidebarItemComponent {
  @Input() route!: string;
  @Input() nzIcon!: string;
  @Input() itemName!: string;

  constructor() {
    this.route = this.parseRoute();
  }

  parseRoute() {
    if (!this.route.startsWith('/')) {
      return '/'.concat(this.route);
    }
    return this.route;
  }
}
