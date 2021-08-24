import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ILoginRequestParams,
  ILoginResponse,
  IRegisterRequestParams,
  IRegisterResponse,
  IVerifyUserRequestParams,
  IVerifyUserResponse,
} from '@interfaces';
import { LocaleType, LocalStorageVars } from '@models';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { LocalStorageService } from '../local-storage';

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

  verifyUser(
    params: IVerifyUserRequestParams
  ): Observable<IVerifyUserResponse> {
    const { token } = params;
    return this.http.get<IVerifyUserResponse>(
      `${env.apiUrl}/users/verification/${token}`,
      httpOptions
    );
  }

  sendVerificationEmail() {
    const localeCode = this.localStorageService
      .getItem<LocaleType>(LocalStorageVars.locale)
      .getValue();
    const params = new HttpParams().set('lang', localeCode);
    console.log(params);
    return this.http.get(`${env.apiUrl}/users/verification/email/me`, {
      params: params,
    });
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
