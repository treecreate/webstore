import { IEnvironment } from './ienvironment';

// production-specific environment
export const environment: IEnvironment = {
  production: true,
  envName: 'production',

  apiUrl: window['env'] ? window['env']['apiUrl'] : 'http://localhost:5000',
};
