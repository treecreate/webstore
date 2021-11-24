import { Component } from '@angular/core';

@Component({
  selector: 'webstore-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'admin-page';
  public sidebarCollapsed: boolean;
  public username: string;
  public content: string;

  constructor() {
    this.sidebarCollapsed = false;
    this.username = 'username@example.com';
    this.content = 'content';
  }

  toggleCollapsed() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
