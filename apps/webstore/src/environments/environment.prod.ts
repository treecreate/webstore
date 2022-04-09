import { IEnvironment } from './ienvironment';

// production-specific environment
export const environment: IEnvironment = {
  production: true,
  envName: 'production',
  locale: 'en-US',

  apiUrl: window['env'] ? window['env']['apiUrl'] : 'http://localhost:5050',
  gtag: window['env'] ? window['env']['gtag'] : 'gtag-for-prod',
};
