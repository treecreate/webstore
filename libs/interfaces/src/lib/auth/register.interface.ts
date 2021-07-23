export interface IRegisterResponse {
  roles: [string];
  accessToken: string;
  tokenType: string;
  userId: string;
  email: string;
}

export interface IRegisterRequestParams {
  email: string;
  password: string;
}
