import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../local-storage';
import { LocalStorageVars } from '@models';
import { IUser } from '@interfaces';

const API_URL = 'http://localhost:5000/auth/test/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  public saveUser(user: IUser): void {
    this.localStorageService.removeItem(LocalStorageVars.authUser);
    this.localStorageService.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(user)
    );
  }

  public getUser(): IUser {
    const user = this.localStorageService
      .getItem<string>(LocalStorageVars.authUser)
      .getValue();
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  getPublicContent(): Observable<string> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<string> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  getDeveloperBoard(): Observable<string> {
    return this.http.get(API_URL + 'developer', { responseType: 'text' });
  }

  getAdminBoard(): Observable<string> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }
}
