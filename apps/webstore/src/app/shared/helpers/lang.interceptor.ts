import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { Observable } from 'rxjs';

@Injectable()
export class LangInterceptor implements HttpInterceptor {
  constructor(private localStorageService: LocalStorageService) {}

  /**
   * Add the lang query param to the api request.
   * @param req the request
   * @param next
   * @returns the original request with the lang query param
   */
  intercept(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: HttpRequest<any>,
    next: HttpHandler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<HttpEvent<any>> {
    // Get selected locale
    let locale = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).value;
    if (locale === null) {
      locale = LocaleType.da;
    }
    const newReq = req.clone({
      params: (req.params ? req.params : new HttpParams()).set('lang', locale),
    });

    return next.handle(newReq);
  }
}

export const langInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: LangInterceptor, multi: true }];
