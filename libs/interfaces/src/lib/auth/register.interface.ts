import { IRole } from '..';

export interface IRegisterResponse {
  userId: string;
  email: string;
  roles: IRole[];
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface IRegisterRequestParams {
  email: string;
  password: string;
}
