
export interface ILoginResponse {
  userId: string;
  email: string;
  roles: String[];
  accessToken: string;
  tokenType: string;
}

export interface ILoginRequestParams {
  email: string;
  password: string;
}
