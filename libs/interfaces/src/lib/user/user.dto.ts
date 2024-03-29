export interface UpdateUserRequest {
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
  createdAt?: string;
}
export interface UpdateUserPasswordRequest {
  token: string;
  password: string;
}

export interface UpdatePasswordAsAdminRequest {
  userId: string;
  password: string;
}
