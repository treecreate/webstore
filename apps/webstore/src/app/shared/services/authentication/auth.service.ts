import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../local-storage';
import { LocalStorageVars } from '@models';

const AUTH_API = 'http://localhost:5000/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password
    }, httpOptions);
  }

  public saveAuthToken(token: string): void {
    this.localStorageService.removeItem(LocalStorageVars.authToken);
    this.localStorageService.setItem(LocalStorageVars.authToken, token);
  }

  public getAuthToken(): string | null {
    return this.localStorageService.getItem<string>(LocalStorageVars.authToken).getValue();
  }

}
