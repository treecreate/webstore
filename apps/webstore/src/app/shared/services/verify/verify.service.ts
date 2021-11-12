import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAuthUser, IUser, IVerifyUserRequestParams, IVerifyUserResponse } from '@interfaces';
import { LocaleType, LocalStorageVars } from '@models';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { AuthService } from '../authentication/auth.service';
import { LocalStorageService } from '@local-storage';
import { UserService } from '../user/user.service';

const httpOptions = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class VerifyService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  getIsVerified(): boolean {
    // fetch verification info if user is logged in
    const authUser = this.authService.getAuthUser();
    if (authUser != null && this.authService.isAccessTokenValid()) {
      this.userService.getUser().subscribe((user: IUser) => {
        if (authUser.isVerified !== user.isVerified) {
          authUser.isVerified = user.isVerified;
          this.localStorageService.setItem<IAuthUser>(LocalStorageVars.authUser, authUser);
        }
      });
      // return current value while the system updates
      return this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser).getValue().isVerified;
    } else {
      return null;
    }
  }

  setIsVerified(isVerified: boolean) {
    const authUser = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser).getValue();
    authUser.isVerified = isVerified;
    this.localStorageService.setItem<IAuthUser>(LocalStorageVars.authUser, authUser);
  }

  verifyUser(params: IVerifyUserRequestParams): Observable<IVerifyUserResponse> {
    const { token } = params;
    return this.http.get<IVerifyUserResponse>(`${env.apiUrl}/users/verification/${token}`, httpOptions);
  }

  sendVerificationEmail() {
    const localeCode = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).getValue();
    const params = new HttpParams().set('lang', localeCode);
    console.log(params);
    return this.http.get(`${env.apiUrl}/users/verification/email/me`, {
      params: params,
    });
  }
}
