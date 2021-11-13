export interface IAuthUser {
  userId: string;
  email: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
}
export interface IUser {
  userId: string;
  email: string;
  roles: string[];
  name?: string;
  phoneNumber?: string;
  streetAddress?: string;
  streetAddress2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  //TODO: add the basket IDesign[] list so it stays even when they leave the page
}
