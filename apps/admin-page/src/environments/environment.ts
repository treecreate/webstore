import { IEnvironment } from './ienvironment';

// Default development environment configuration
export const environment: IEnvironment = {
  production: false,
  envName: 'development',

  apiUrl: window['env'] ? window['env']['apiUrl'] : 'http://localhost:5050',
  webstoreUrl: window['env'] ? window['env']['webstoreUrl'] : 'http://localhost:4200',
};
