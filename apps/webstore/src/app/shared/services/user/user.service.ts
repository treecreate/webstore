import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../local-storage';
import { LocalStorageVars } from '@models';
import { IAuthUser, IUser, UpdateUserRequest } from '@interfaces';

const API_URL = 'http://localhost:5000';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  // Save auth user information to local storage
  public saveAuthUser(user: IAuthUser): void {
    this.localStorageService.removeItem(LocalStorageVars.authUser);
    this.localStorageService.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(user)
    );
  }

  // Get user information for authentication. The data comes from local storage. Use getUser() to get full user entity
  public getAuthUser(): IAuthUser {
    const user = this.localStorageService
      .getItem<string>(LocalStorageVars.authUser)
      .getValue();
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public getUser(): Observable<IUser> {
    return this.http.get<IUser>(`${API_URL}/users/me`);
  }

  public updateUser(params: UpdateUserRequest): Observable<IUser> {
    return this.http.put<IUser>(`${API_URL}/users`, params);
  }

  getPublicContent(): Observable<string> {
    return this.http.get(API_URL + '/auth/test/all', { responseType: 'text' });
  }

  getUserBoard(): Observable<string> {
    return this.http.get(API_URL + '/auth/test/user', { responseType: 'text' });
  }

  getDeveloperBoard(): Observable<string> {
    return this.http.get(API_URL + '/auth/test/developer', {
      responseType: 'text',
    });
  }

  getAdminBoard(): Observable<string> {
    return this.http.get(API_URL + '/auth/test/admin', {
      responseType: 'text',
    });
  }
}
