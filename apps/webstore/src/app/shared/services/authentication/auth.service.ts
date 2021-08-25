import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ILoginRequestParams,
  ILoginResponse,
  IRegisterRequestParams,
  IRegisterResponse,
  IUser,
  IVerifyUserRequestParams,
  IVerifyUserResponse,
} from '@interfaces';
import { LocaleType, LocalStorageVars } from '@models';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { LocalStorageService } from '../local-storage';
import { UserService } from '../user/user.service';

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
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private router: Router
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

  getIsVerified(): boolean {
    // fetch verification info if user is logged in
    if (this.getAuthToken() != null) {
      this.userService.getUser().subscribe((user: IUser) => {
        if (
          this.localStorageService
            .getItem<boolean>(LocalStorageVars.isVerified)
            .getValue() !== user.isVerified
        ) {
          this.localStorageService.setItem<boolean>(
            LocalStorageVars.isVerified,
            user.isVerified
          );
        }
      });
      // return current value while the system updates
      return this.localStorageService
        .getItem<boolean>(LocalStorageVars.isVerified)
        .getValue();
    } else {
      return null;
    }
  }

  setIsVerified(isVerified: boolean) {
    this.localStorageService.setItem<boolean>(
      LocalStorageVars.isVerified,
      isVerified
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
    this.localStorageService.removeItem(LocalStorageVars.isVerified);
    this.router.navigate(['/home']);
  }

  public saveAuthToken(token: string): void {
    this.localStorageService.removeItem(LocalStorageVars.authToken);
    this.localStorageService.setItem<string>(LocalStorageVars.authToken, token);
  }

  public getAuthToken(): string | null {
    return this.localStorageService
      .getItem<string>(LocalStorageVars.authToken)
      .getValue();
  }
}
