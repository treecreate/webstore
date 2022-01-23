import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/authentication/auth.service';

const TOKEN_HEADER_KEY = 'Authorization'; // for Spring Boot back-end
// const TOKEN_HEADER_KEY = 'x-access-token';   // for Node.js Express back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  /**
   * Add the bearer token to the api request if the user is authenticated.
   * If the accessToken is expired, it will try to refresh it using the refreshToken.
   * @param req the request
   * @param next
   * @returns the original request with the authentication token
   */
  intercept(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: HttpRequest<any>,
    next: HttpHandler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<HttpEvent<any>> {
    let authReq = req;

    // Access token refresh logic
    // check if the user is authenticated
    if (this.authService.getAuthUser() != null) {
      // if the request is to refresh the tokens, use the refresh token instead of the access token
      if (req.url.includes('/auth/refresh')) {
        authReq = req.clone({
          headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + this.authService.getAuthUser().refreshToken),
        });
        return next.handle(authReq);
      }
      // check that the token is not expired, and perform a refresh if it is
      if (this.authService.isJwtExpired(this.authService.getAuthUser().accessToken)) {
        // 1 second after the request is send, refresh the token
        setTimeout(() => {
          this.authService.refreshAccessToken();
        }, 1000);

        //  add the refresh token for authentiation instead of the expired access token
        authReq = req.clone({
          headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + this.authService.getAuthUser().refreshToken),
        });
        return next.handle(authReq);
      } else {
        // add the access token as the bearer token for authentication
        authReq = req.clone({
          headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + this.authService.getAuthUser().accessToken),
        });
        return next.handle(authReq);
      }
    } else {
      // basically, do nothing since the request doesn't need to be authenticated
      return next.handle(authReq);
    }
  }
}

export const authInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }];
