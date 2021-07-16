export interface ILoginResponse {
  id: number;
  username: string;
  password: string;
  email: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
}

export interface ILoginRequestParams {
  username: string;
  password: string;
}
