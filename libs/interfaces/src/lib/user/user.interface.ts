export interface IUser {
  id: number;
  password: string;
  email: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
}
