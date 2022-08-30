import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, UpdateUserPasswordRequest, UpdateUserRequest } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  public getUser(): Observable<IUser> {
    return this.http.get<IUser>(`${env.apiUrl}/users/me`);
  }

  public updateUser(params: UpdateUserRequest): Observable<IUser> {
    return this.http.put<IUser>(`${env.apiUrl}/users`, params);
  }

  public sendResetUserPassword(email: string): Observable<void> {
    let locale = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).value;
    if (locale === null) {
      locale = LocaleType.da;
    }
    return this.http.get<void>(`${env.apiUrl}/users/resetPassword/${email}?lang=${locale}`);
  }

  public updatePassword(params: UpdateUserPasswordRequest) {
    return this.http.put<IUser>(`${env.apiUrl}/users/updatePassword`, params);
  }

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
