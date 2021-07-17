import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../local-storage';
import { LocalStorageVars } from '@models';
import {
  ILoginRequestParams,
  ILoginResponse,
  IRegisterRequestParams,
  IRegisterResponse,
} from '@interfaces';

const AUTH_API = 'http://localhost:5000/auth/';

const httpOptions = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  login(params: ILoginRequestParams): Observable<ILoginResponse> {
    const { email, password } = params;
    return this.http.post<ILoginResponse>(
      AUTH_API + 'signin',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  register(params: IRegisterRequestParams): Observable<IRegisterResponse> {
    const { email, password } = params;
    return this.http.post<IRegisterResponse>(
      AUTH_API + 'signup',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  public logout() {
    this.localStorageService.removeItem(LocalStorageVars.authToken);
    this.localStorageService.removeItem(LocalStorageVars.authUser);
  }

  public saveAuthToken(token: string): void {
    this.localStorageService.removeItem(LocalStorageVars.authToken);
    this.localStorageService.setItem(LocalStorageVars.authToken, token);
  }

  public getAuthToken(): string | null {
    return this.localStorageService
      .getItem<string>(LocalStorageVars.authToken)
      .getValue();
  }
}
