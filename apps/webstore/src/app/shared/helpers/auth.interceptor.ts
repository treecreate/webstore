import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

//import { TokenStorageService } from '../_services/token-storage.service';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage';
import { LocalStorageVars } from '@models';

const TOKEN_HEADER_KEY = 'Authorization'; // for Spring Boot back-end
// const TOKEN_HEADER_KEY = 'x-access-token';   // for Node.js Express back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    /*private token: TokenStorageService,*/ private localStorageService: LocalStorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req;
    //const token = this.token.getToken();
    const token = this.localStorageService
      .getItem<string>(LocalStorageVars.authToken)
      .getValue();
    console.log(token);
    if (token != null) {
      // for Spring Boot back-end
      authReq = req.clone({
        headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token),
      });
    }
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
