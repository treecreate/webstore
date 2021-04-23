import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'webstore-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less'],
})
export class AuthComponent {
  isAuthenticated: boolean;

  constructor(private oktaAuth: OktaAuthService, private router: Router) {
    this.oktaAuth.$authenticationState.subscribe((isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
  }
}
