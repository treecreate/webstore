import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../local-storage';
import { LocalStorageVars } from '@models';

const API_URL = 'http://localhost:5000/api/test/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  public saveUser(user: any): void {
    this.localStorageService.removeItem(LocalStorageVars.authUser);
    this.localStorageService.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(user)
    );
  }

  public getUser(): any {
    const user = this.localStorageService
      .getItem<string>(LocalStorageVars.authUser)
      .getValue();
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }
}
