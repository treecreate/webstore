import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAuthUser } from '@interfaces';
import { LocalStorageVars } from '@models';
//import { TokenStorageService } from '../_services/token-storage.service';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage';

const TOKEN_HEADER_KEY = 'Authorization'; // for Spring Boot back-end
// const TOKEN_HEADER_KEY = 'x-access-token';   // for Node.js Express back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    /*private token: TokenStorageService,*/ private localStorageService: LocalStorageService
  ) {}

  intercept(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: HttpRequest<any>,
    next: HttpHandler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<HttpEvent<any>> {
    let authReq = req;
    const authUser = this.localStorageService
      .getItem<IAuthUser>(LocalStorageVars.authUser)
      .getValue();
    if (authUser != null) {
      // for Spring Boot back-end
      authReq = req.clone({
        headers: req.headers.set(
          TOKEN_HEADER_KEY,
          'Bearer ' + authUser.accessToken
        ),
      });
    }
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
