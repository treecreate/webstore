export interface ILoginResponse {
  id: number;
  email: string;
  password: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
}

export interface ILoginRequestParams {
  email: string;
  password: string;
}
