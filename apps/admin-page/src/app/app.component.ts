import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'webstore-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'admin-page';
  sidebarCollapsed = false;
  username = 'username@example.com';

  constructor(public router: Router) {}

  /**
   * Toggles the `sidebarCollapsed` boolean.
   */
  toggleCollapsed(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
