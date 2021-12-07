import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, UpdatePasswordAsAdminRequest, UpdateUserRequest } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';

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

  public updatePassword(params: UpdatePasswordAsAdminRequest) {
    return this.http.put<IUser>(`${env.apiUrl}/users/${params.userId}`, { password: params.password });
  }
}
