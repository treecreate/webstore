export interface IUser {
  id: number;
  username: string;
  password: string;
  email: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
}
