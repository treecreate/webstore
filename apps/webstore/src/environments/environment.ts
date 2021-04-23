import { IEnvironment } from './ienvironment';

// Default development environment configuration
export const environment: IEnvironment = {
  production: false,
  envName: 'development',
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
  gtag: window['env'] ? window['env']['gtag'] : 'gtag-for-dev',
};
