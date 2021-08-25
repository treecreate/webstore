import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  IAuthUser,
  ILoginRequestParams,
  ILoginResponse,
  IRegisterRequestParams,
  IRegisterResponse,
} from '@interfaces';
import { LocalStorageVars } from '@models';
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
