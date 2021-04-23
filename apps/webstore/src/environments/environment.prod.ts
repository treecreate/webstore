import { IEnvironment } from './ienvironment';

// production-specific environment
export const environment: IEnvironment = {
  production: true,
  envName: 'production',
  locale: 'en-US',

  okta: {
    oktaDomain: window['env'] && window['env']['oktaDomain'],
    clientId: window['env'] && window['env']['oktaClientId'],
    idpGoogle: window['env'] && window['env']['idpGoogle'],
    idpFacebook: window['env'] && window['env']['idpFacebook'],
    idpLinkedIn: window['env'] && window['env']['idpLinkedIn'],
    idpApple: window['env'] && window['env']['idpApple'],
  },

  apiUrl: window['env'] ? window['env']['apiUrl'] : 'http://localhost:5000',
  gtag: window['env'] ? window['env']['gtag'] : 'gtag-for-prod',
};
