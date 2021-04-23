import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthService, OktaConfig } from '@okta/okta-angular';
import { environment as env } from '../environments/environment';

const ISSUER = env.okta.oktaDomain;
const CLIENT_ID = env.okta.clientId;
const REDIRECT_URI = `${window.location.origin}/login/callback`;

const onAuthRequired = (oktaAuth: OktaAuthService, injector: Injector) => {
  const router = injector.get<Router>(Router);
  router.navigate(['/login']); // OktaAuthGuard will redirect here unauthenticated users
};

export const oktaConfig: OktaConfig = {
  issuer: ISSUER,
  clientId: CLIENT_ID,
  redirectUri: REDIRECT_URI,
  pkce: true,
  postLogoutRedirectUri: `${window.location.origin}`,
  onAuthRequired: onAuthRequired,
  scopes: ['openid', 'profile', 'email'],
};
