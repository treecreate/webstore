import { Component } from '@angular/core';

@Component({
  selector: 'webstore-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'admin-page';
   sidebarCollapsed = false;
   username = 'username@example.com';

  toggleCollapsed() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
