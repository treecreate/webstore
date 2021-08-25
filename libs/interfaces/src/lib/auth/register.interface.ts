export interface IRegisterResponse {
  userId: string;
  email: string;
  isVerified: boolean;
  roles: string[];
  accessToken: string;
  tokenType: string;
}

export interface IRegisterRequestParams {
  email: string;
  password: string;
}
