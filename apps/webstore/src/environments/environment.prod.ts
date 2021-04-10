import { IEnvironment } from './ienvironment';

// production-specific environment
export const environment: IEnvironment = {
    production: true,
    envName: 'production',

    apiUrl: window['env'] ? window['env']['apiUrl'] : 'http://localhost:5000',
    gtag: window['env'] ? window['env']['gtag'] : 'gtag-for-prod',
};
