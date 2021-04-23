import { Component } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { environment as env } from '../../../../../environments/environment';

@Component({
  selector: 'webstore-linkedin-button',
  templateUrl: './linkedin-button.component.html',
  styleUrls: ['./linkedin-button.component.less'],
})
export class LinkedinButtonComponent {
  constructor(private oktaAuth: OktaAuthService) {}

  linkedinSingIn() {
    this.oktaAuth.token.getWithRedirect({
      idp: env.okta.idpLinkedIn,
      responseType: 'code',
    });
  }
}
