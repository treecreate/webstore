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
  username?: string;

  constructor(public router: Router, private authService: AuthService, private snackBar: MatSnackBar) {
    this.username = this.authService.getAuthUser()?.email;
  }

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
