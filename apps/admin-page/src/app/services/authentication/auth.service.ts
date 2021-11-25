import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthUser, ILoginRequestParams, ILoginResponse, IRegisterRequestParams, IRegisterResponse } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';

const httpOptions = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService, private router: Router) {}

  /**
   * Perform a login request to the API
   * @param params user credentials
   * @returns observable of the API request
   */
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

  /**
   * Perform a signup/registration request to the API
   * @param params user credentials
   * @returns observable of the API request
   */
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

  /**
   * Remove the user authentication information from local storage
   */
  public logout(): void {
    this.localStorageService.removeItem(LocalStorageVars.authUser);
    // the tree design should no longer be accessible
    this.localStorageService.removeItem(LocalStorageVars.designFamilyTree);
    this.router.navigate(['/home']);
  }

  /**
   * Save auth user information to local storage
   * @param user authUser object with information like accessToken
   */
  public saveAuthUser(user: IAuthUser): void {
    this.localStorageService.removeItem(LocalStorageVars.authUser);
    this.localStorageService.setItem<IAuthUser>(LocalStorageVars.authUser, user);
  }

  /**
   * Get user information for authentication. The data comes from local storage. Use getUser() to get full user entity
   * @returns user information needed for authentication and authorization. Returns null if no information is found
   */
  public getAuthUser(): IAuthUser | null {
    const user = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);
    if (user) {
      return user.getValue();
    }
    return null;
  }

  /**
   * Validates that the access token saved in the local storage is valid and not expired
   * @returns whether the access token is valid and not expired
   */
  public isAccessTokenValid(): boolean {
    const authUser = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);
    if (authUser !== null && authUser.getValue() != null) {
      const accessToken = authUser.getValue()?.accessToken;
      if (accessToken === undefined) {
        return false;
      }
      const isExpired = this.isJwtExpired(accessToken);
      if (isExpired) {
        console.warn('Your session has expired, logging you out');
        this.localStorageService.removeItem(LocalStorageVars.authUser);
      }
      return !isExpired;
    }
    return false;
  }

  /**
   * Validates if the given JWT is expired
   * @param token JWT token
   * @returns whether it is expired or not
   */
  public isJwtExpired(token: string): boolean {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }
}