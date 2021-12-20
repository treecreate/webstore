import { IRole } from '..';

export interface ILoginResponse {
  userId: string;
  email: string;
  roles: IRole[];
  accessToken: string;
  tokenType: string;
}

export interface ILoginRequestParams {
  email: string;
  password: string;
}
