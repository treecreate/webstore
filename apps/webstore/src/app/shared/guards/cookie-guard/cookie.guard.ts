// Guards are used by the routing modules to add logic for whether or not a given route can be accessed etc
// This route ensures that the users cannot access normal pages if they have rejected our cookies

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { LocalStorageService } from '../../services/local-storage';
import { LocalStorageVars, CookieStatus } from '@models';

@Injectable({
  providedIn: 'root',
})
export class CookieGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const cookieStatus = this.localStorageService
      .getItem<CookieStatus>(LocalStorageVars.cookiesAccepted)
      .getValue();
    if (
      cookieStatus != CookieStatus.accepted &&
      cookieStatus != CookieStatus.undefined
    ) {
      console.warn('You need to accept cookies before you can use our website');
      this.router.navigate(['/rejectedCookies']); // redirect when authorization fails
      return false;
    }
    return true;
  }
}
