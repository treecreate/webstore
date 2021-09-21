import { IAuthUser } from '@interfaces';

export const authUser: IAuthUser = {
  email: 'e2e@test.com',
  accessToken: '',
  roles: ['ROLE_USER'],
  tokenType: 'Bearer',
  userId: '7f000001-7b0d-19bf-817b-0d0a8ec40000',
  isVerified: true,
};

export const authUserRoleDeveloper: IAuthUser = {
  email: 'e2e-dev@test.com',
  accessToken: '',
  roles: ['ROLE_USER', 'ROLE_DEVELOPER'],
  tokenType: 'Bearer',
  userId: '7f000001-7b0d-19bf-817b-0d0a8ec40000',
  isVerified: true,
};

export const authUserRoleOwner: IAuthUser = {
  email: 'e2e-owner@test.com',
  accessToken: '',
  roles: ['ROLE_USER', 'ROLE_OWNER'],
  tokenType: 'Bearer',
  userId: '7f000001-7b0d-19bf-817b-0d0a8ec40000',
  isVerified: true,
};

export const authUserExpired: IAuthUser = {
  email: 'e2e-expired@test.com',
  accessToken: '',
  roles: ['ROLE_USER'],
  tokenType: 'Bearer',
  userId: '7f000001-7b0d-19bf-817b-0d0a8ec40000',
  isVerified: true,
};

export const authUserInvalid: IAuthUser = {
  email: 'e2e-invalid@test.com',
  accessToken: '',
  roles: ['ROLE_USER', 'ROLE_DEVELOPER'],
  tokenType: 'Bearer',
  userId: '7f000001-7b0d-19bf-817b-0d0a8ec40000',
  isVerified: true,
};

export const authUserNotVerified: IAuthUser = {
  email: 'e2e-not-verified@test.com',
  accessToken: '',
  roles: ['ROLE_USER'],
  tokenType: 'Bearer',
  userId: '7f000001-7b0d-19bf-817b-0d0a8ec40000',
  isVerified: false,
};
