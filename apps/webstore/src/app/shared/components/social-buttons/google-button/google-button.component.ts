import { Component } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { environment as env } from '../../../../../environments/environment';

@Component({
  selector: 'webstore-google-button',
  templateUrl: './google-button.component.html',
  styleUrls: ['./google-button.component.less'],
})
export class GoogleButtonComponent {
  constructor(private oktaAuth: OktaAuthService) {}

  googleSignIn() {
    this.oktaAuth.token.getWithRedirect({
      idp: env.okta.idpGoogle,
      responseType: 'code',
    });
  }
}
