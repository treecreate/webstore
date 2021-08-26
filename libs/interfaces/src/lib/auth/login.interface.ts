export interface ILoginResponse {
  userId: string;
  email: string;
  isVerified: boolean;
  roles: string[];
  accessToken: string;
  tokenType: string;
}

export interface ILoginRequestParams {
  email: string;
  password: string;
}
