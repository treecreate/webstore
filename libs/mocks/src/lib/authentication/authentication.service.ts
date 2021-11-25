import { Injectable } from '@angular/core';
import { IAuthUser } from '@interfaces';
import { AuthUserEnum } from '.';
import { authUser, authUserExpired, authUserInvalid, authUserRoleDeveloper, authUserRoleOwner } from './auth-user.mock';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  header = {
    alg: 'none',
  };
  constructor() {}

  getMockUser(authUserType: AuthUserEnum): IAuthUser {
    let authUserMock: IAuthUser;
    switch (authUserType) {
      case AuthUserEnum.authUser:
        authUserMock = authUser;
        authUserMock.accessToken = this.generateAccessToken(true, authUserMock.email);
        break;
      case AuthUserEnum.authUserRoleDeveloper:
        authUserMock = authUserRoleDeveloper;
        authUserMock.accessToken = this.generateAccessToken(true, authUserMock.email);
        break;
      case AuthUserEnum.authUserRoleOwner:
        authUserMock = authUserRoleOwner;
        authUserMock.accessToken = this.generateAccessToken(true, authUserMock.email);
        break;
      case AuthUserEnum.authUserExpired:
        authUserMock = authUserExpired;
        authUserMock.accessToken = this.generateAccessToken(false, authUserMock.email);
        break;
      case AuthUserEnum.authUserInvalid:
        authUserMock = authUserInvalid;
        break;
    }
    return authUserMock;
  }

  private generateAccessToken(validExpDate: boolean, email: string): string {
    const currentDate = new Date();

    const data = {
      sub: email,
      // Set the issued date to yesterday
      iat: Math.floor(new Date(currentDate.getTime() - 86400000).getTime() / 1000),
      // If the token should be still valid, the exp date is ahead of today. Otherwise, it is before
      exp: Math.floor(new Date(currentDate.getTime() + (validExpDate ? 86400000 : -86400000)).getTime() / 1000),
    };
    // return the encoded access token
    return `${this.encodeBase64url(JSON.stringify(this.header))}.${this.encodeBase64url(JSON.stringify(data))}`;
  }

  private encodeBase64url(data: string): string {
    return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
