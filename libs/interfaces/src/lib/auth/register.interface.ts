export interface IRegisterResponse {
  userId: string;
  email: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
}

export interface IRegisterRequestParams {
  email: string;
  password: string;
}
