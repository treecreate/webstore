// interface for the different environment files. Defines what properties have to be present
export interface IEnvironment {
  production: boolean;
  envName: string;
  locale: string;

  apiUrl: string;
  gtag: string;
}
