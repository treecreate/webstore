export class UpdateUserRequest {
  email?: string;
  password?: string;
  roles?: string[];
  name?: string;
  phoneNumber?: string;
  streetAddress?: string;
  streetAddress2?: string;
  city?: string;
  postcode?: string;
  country?: string;
}
export class UpdateUserPasswordRequest {
  token: string;
  password: string;
}
