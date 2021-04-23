import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'webstore-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isAuthenticated: boolean;

  constructor(public oktaAuth: OktaAuthService) {
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
  }

  login() {
    this.oktaAuth.loginRedirect();
  }

  logout() {
    this.oktaAuth.logout('/');
  }

}
