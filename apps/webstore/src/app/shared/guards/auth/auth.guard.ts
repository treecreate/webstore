import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
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
              roles: ['ROLE_USER'],
            },
          },
        `;
    }

    const authUser = this.userService.getUser();
    console.log('Auth user: ' + authUser);
    // Check if the user data even exists
    if (authUser == null) {
      this.router.navigate(['/PageNotFound'], { skipLocationChange: true });
      return false;
    }

    // check if the user is authorized to view the given page
    const userRoles: [string] = authUser.roles;
    const isAuthorized = userRoles.includes(...requiredRoles);
    if (!isAuthorized) {
      this.router.navigate(['/PageNotFound'], { skipLocationChange: true });
    }
    return isAuthorized;
  }
}
