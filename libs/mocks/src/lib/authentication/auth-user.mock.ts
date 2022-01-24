import { IAuthUser } from '@interfaces';
import { UserRoles } from '@models';

export const authUser: IAuthUser = {
  email: 'e2e@test.com',
  accessToken: '',
  refreshToken: '',
  roles: [{ name: UserRoles.user, roleId: '' }],
  tokenType: 'Bearer',
  userId: '7f000001-7b0d-19bf-817b-0d0a8ec40000',
};

export const authUserRoleDeveloper: IAuthUser = {
  email: 'e2e-dev@test.com',
  accessToken: '',
  refreshToken: '',
  roles: [
    { name: UserRoles.user, roleId: '' },
    { name: UserRoles.developer, roleId: '' },
  ],
  tokenType: 'Bearer',
  userId: '7f000001-7b0d-19bf-817b-0d0a8ec40000',
};

export const authUserRoleAdmin: IAuthUser = {
  email: 'e2e-owner@test.com',
  accessToken: '',
  refreshToken: '',
  roles: [
    { name: UserRoles.user, roleId: '' },
    { name: UserRoles.admin, roleId: '' },
  ],
  tokenType: 'Bearer',
  userId: '7f000001-7b0d-19bf-817b-0d0a8ec40000',
};

export const authUserExpired: IAuthUser = {
  email: 'e2e-expired@test.com',
  accessToken: '',
  refreshToken: '',
  roles: [{ name: UserRoles.user, roleId: '' }],
  tokenType: 'Bearer',
  userId: '7f000001-7b0d-19bf-817b-0d0a8ec40000',
};

export const authUserInvalid: IAuthUser = {
  email: 'e2e-invalid@test.com',
  accessToken: '',
  refreshToken: '',
  roles: [
    { name: UserRoles.user, roleId: '' },
    { name: UserRoles.developer, roleId: '' },
  ],
  tokenType: 'Bearer',
  userId: '7f000001-7b0d-19bf-817b-0d0a8ec40000',
};

export const authUserNotVerified: IAuthUser = {
  email: 'e2e-not-verified@test.com',
  accessToken: '',
  refreshToken: '',
  roles: [{ name: UserRoles.user, roleId: '' }],
  tokenType: 'Bearer',
  userId: '7f000001-7b0d-19bf-817b-0d0a8ec40000',
};
