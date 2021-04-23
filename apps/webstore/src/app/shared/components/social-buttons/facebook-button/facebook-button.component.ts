import { Component } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { environment as env } from '../../../../../environments/environment';

@Component({
  selector: 'webstore-facebook-button',
  templateUrl: './facebook-button.component.html',
  styleUrls: ['./facebook-button.component.less'],
})
export class FacebookButtonComponent {
  constructor(private oktaAuth: OktaAuthService) {}

  facebookSignIn() {
    this.oktaAuth.token.getWithRedirect({
      idp: env.okta.idpFacebook,
      responseType: 'code',
    });
  }
}
