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

  /**
   * Call the api to get the currently authentikated user.
   *
   * @returns the user as an observable.
   */
  public getCurrentUser(): Observable<IUser> {
    return this.http.get<IUser>(`${env.apiUrl}/users/me`);
  }

  /**
   * Call api to update a user. Send all the user info needed. None of the fields are *required* for the call.
   *
   * @param params ( UpdateUserRequest )
   * @returns the updated user as an observable.
   */
  public updateUser(params: UpdateUserRequest): Observable<IUser> {
    return this.http.put<IUser>(`${env.apiUrl}/users`, params);
  }

  /**
   * Calls api to update a users password.
   *
   * @param params ( UpdatePasswordAsAdminRequest = { userId: string, password: string } )
   * @returns the updated user as an observable.
   */
  public updatePassword(params: UpdatePasswordAsAdminRequest): Observable<IUser> {
    return this.http.put<IUser>(`${env.apiUrl}/users/${params.userId}`, { password: params.password });
  }
}
