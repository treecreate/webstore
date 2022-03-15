import { IEnvironment } from './ienvironment';

// production-specific environment
export const environment: IEnvironment = {
  production: true,
  envName: 'production',

  apiUrl: window['env'] ? window['env']['apiUrl'] : 'http://localhost:5050',
  webstoreUrl: window['env'] ? window['env']['webstoreUrl'] : 'http://localhost:4200',
};
