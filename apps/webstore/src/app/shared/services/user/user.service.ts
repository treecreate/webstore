import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, UpdateUserRequest } from '@interfaces';
import { LocaleType, LocalStorageVars } from '@models';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { LocalStorageService } from '../local-storage';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  public getUser(): Observable<IUser> {
    return this.http.get<IUser>(`${env.apiUrl}/users/me`);
  }

  public updateUser(params: UpdateUserRequest): Observable<IUser> {
    return this.http.put<IUser>(`${env.apiUrl}/users`, params);
  }

  public sendResetUserPassword(email: string): Observable<any> {
    const localeCode = this.localStorageService
      .getItem<LocaleType>(LocalStorageVars.locale)
      .getValue();
    const params = new HttpParams().set('lang', localeCode);
    return this.http.get(`${env.apiUrl}/users/resetPassword/${email}`, {
      params: params,
    });
  }

  // public resetUserPassword(token: String, password: String) {
  //   return this.http.put<IUser>(`${env.apiUrl}/`)
  // }

  getPublicContent(): Observable<string> {
    return this.http.get(env.apiUrl + '/auth/test/all', {
      responseType: 'text',
    });
  }

  getUserBoard(): Observable<string> {
    return this.http.get(env.apiUrl + '/auth/test/user', {
      responseType: 'text',
    });
  }

  getDeveloperBoard(): Observable<string> {
    return this.http.get(env.apiUrl + '/auth/test/developer', {
      responseType: 'text',
    });
  }

  getAdminBoard(): Observable<string> {
    return this.http.get(env.apiUrl + '/auth/test/admin', {
      responseType: 'text',
    });
  }
}
