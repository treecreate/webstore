import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, UpdateUserRequest } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public getUser(): Observable<IUser> {
    return this.http.get<IUser>(`${env.apiUrl}/users/me`);
  }

  public updateUser(params: UpdateUserRequest): Observable<IUser> {
    return this.http.put<IUser>(`${env.apiUrl}/users`, params);
  }

  // public resetUserPassword(email: string): Observable<any> {
  //   return this.http.post(env.apiUrl + '/resetPassword', email);
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
