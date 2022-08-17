import { IEnvironment } from './ienvironment';

// Default development environment configuration
export const environment: IEnvironment = {
  production: false,
  envName: 'development',
  locale: 'en-US',

  apiUrl: window['env'] ? window['env']['apiUrl'] : 'http://localhost:5050',
  gtag: window['env'] ? window['env']['gtag'] : 'gtag-for-dev',
};
