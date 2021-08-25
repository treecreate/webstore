import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  IAuthUser,
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
    if (this.getAuthUser() != null) {
      this.userService.getUser().subscribe((user: IUser) => {
        const authUser = this.localStorageService
          .getItem<IAuthUser>(LocalStorageVars.authUser)
          .getValue();
        if (authUser.isVerified !== user.isVerified) {
          authUser.isVerified = user.isVerified;
          this.localStorageService.setItem<IAuthUser>(
            LocalStorageVars.authUser,
            authUser
          );
        }
      });
      // return current value while the system updates
      return this.localStorageService
        .getItem<IAuthUser>(LocalStorageVars.authUser)
        .getValue().isVerified;
    } else {
      return null;
    }
  }

  setIsVerified(isVerified: boolean) {
    const authUser = this.localStorageService
      .getItem<IAuthUser>(LocalStorageVars.authUser)
      .getValue();
    authUser.isVerified = isVerified;
    this.localStorageService.setItem<IAuthUser>(
      LocalStorageVars.authUser,
      authUser
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
    this.localStorageService.removeItem(LocalStorageVars.authUser);
    this.router.navigate(['/home']);
  }

  // Save auth user information to local storage
  public saveAuthUser(user: IAuthUser): void {
    this.localStorageService.removeItem(LocalStorageVars.authUser);
    this.localStorageService.setItem<IAuthUser>(
      LocalStorageVars.authUser,
      user
    );
  }

  // Get user information for authentication. The data comes from local storage. Use getUser() to get full user entity
  public getAuthUser(): IAuthUser {
    const user = this.localStorageService
      .getItem<IAuthUser>(LocalStorageVars.authUser)
      .getValue();
    if (user) {
      return user;
    }

    return null;
  }
}
