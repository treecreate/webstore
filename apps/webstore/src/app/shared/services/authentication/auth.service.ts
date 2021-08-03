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
import { environment as env } from '../../../../environments/environment';

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
      `${env.apiUrl}/auth/signin`,
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
      `${env.apiUrl}/auth/signup`,
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
