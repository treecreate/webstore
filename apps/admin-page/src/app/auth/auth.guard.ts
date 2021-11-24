import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { IAuthUser } from '@interfaces';
import { Observable } from 'rxjs';
import { AuthService } from '../services/authentication/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles: [string] = route?.data.roles;

    if (!requiredRoles) {
      // eslint-disable-next-line no-throw-literal
      throw `
        Roles array in the Route \`data\` property has to be provided for AuthGuard.
          Example:
          {
            path: 'profile',
            component: ProfileComponent,
            canActivate: [AuthGuard],
            data: {
              roles: ['ROLE_ADMIN],
            },
          },
        `;
    }

    // Check if the authentication data is correct
    if (!this.authService.isAccessTokenValid()) {
      this.router.navigate(['/PageNotFound'], { skipLocationChange: true });
      return false;
    }

    // check if the user is authorized to view the given page
    const authUser: IAuthUser | null = this.authService.getAuthUser();
    if (authUser === null) {
      return false;
    }
    const userRoles: string[] = authUser.roles;
    const isAuthorized = userRoles.includes(...requiredRoles);
    if (!isAuthorized) {
      this.router.navigate(['/PageNotFound'], { skipLocationChange: true });
    }
    return isAuthorized;
  }
}
