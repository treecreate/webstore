export interface ILoginResponse {
  userId: string;
  email: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
}

export interface ILoginRequestParams {
  email: string;
  password: string;
}
