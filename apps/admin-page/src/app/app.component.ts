import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from './services/authentication/auth.service';

@Component({
  selector: 'webstore-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'admin-page';
  sidebarCollapsed = false;
  username = 'username@example.com';

  constructor(public router: Router, private authService: AuthService, private snackBar: MatSnackBar) {}

  /**
   * Toggles the `sidebarCollapsed` boolean.
   */
  toggleCollapsed(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout() {
    this.snackBar.open('You have logged out', 'Wauw');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
