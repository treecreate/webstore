import { Component } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { environment as env } from '../../../../../environments/environment';

@Component({
  selector: 'webstore-apple-button',
  templateUrl: './apple-button.component.html',
  styleUrls: ['./apple-button.component.less'],
})
export class AppleButtonComponent {
  constructor(private oktaAuth: OktaAuthService) {}

  appleSignIn() {
    this.oktaAuth.token.getWithRedirect({
      idp: env.okta.idpApple,
      responseType: 'code',
    });
  }
}
