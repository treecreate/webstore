import { UserRoles } from '@models';
import { IBase } from '..';
export interface IAuthUser {
  userId: string;
  email: string;
  roles: IRole[];
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface IUser extends IBase {
  userId: string;
  email: string;
  roles: IRole[];
  name?: string;
  phoneNumber?: string;
  streetAddress?: string;
  streetAddress2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  //TODO: add the basket IDesign[] list so it stays even when they leave the page
}

export interface IRole extends IBase {
  roleId: string;
  name: UserRoles;
}
