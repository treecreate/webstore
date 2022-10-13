import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthUser, ILoginRequestParams, ILoginResponse, IRegisterRequestParams, IRegisterResponse } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

const httpOptions = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService, private router: Router) {}

  private refreshingTokens = false;

  /**
   * Perform a login request to the API
   * @param params user credentials
   * @returns observable of the API request
   */
  login(params: ILoginRequestParams): Observable<ILoginResponse> {
    const { email, password } = params;
    const eventLogUserId = this.localStorageService.getItem(LocalStorageVars.eventLogUserId).value;
    return this.http.post<ILoginResponse>(
      `${env.apiUrl}/auth/signin${eventLogUserId ? '?eventLogUserId=' + eventLogUserId : ''}`,
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
    let locale = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).value;
    if (locale === null) {
      locale = LocaleType.da;
    }
    const eventLogUserId = this.localStorageService.getItem(LocalStorageVars.eventLogUserId).value;
    return this.http.post<IRegisterResponse>(
      `${env.apiUrl}/auth/signup?lang=${locale}${eventLogUserId ? '&eventLogUserId=' + eventLogUserId : ''}`,
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
  registerOnOrder(params: IRegisterRequestParams): Observable<IRegisterResponse> {
    const { email, password } = params;
    let locale = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).value;
    if (locale === null) {
      locale = LocaleType.da;
    }
    const eventLogUserId = this.localStorageService.getItem(LocalStorageVars.eventLogUserId).value;
    return this.http.post<IRegisterResponse>(
      `${env.apiUrl}/auth/signup?sendPasswordEmail=true&lang=${locale}${
        eventLogUserId ? '&eventLogUserId=' + eventLogUserId : ''
      }`,
      {
        email,
        password,
      },
      httpOptions
    );
  }

  /**
   * Remove the logged in user information from local storage and API
   * @param callApi whether or not it should perform a /logout api call. Not needed when you know the user is already logged out
   */
  public logout(callApi: boolean = true): void {
    if (callApi) {
      this.http.get<void>(`${env.apiUrl}/auth/logout`).subscribe();
    }
    this.localStorageService.removeItem(LocalStorageVars.authUser);
    this.localStorageService.removeItem(LocalStorageVars.designFamilyTree);
    this.localStorageService.removeItem(LocalStorageVars.transactionItems);
    this.router.navigate(['/']);
  }

  /**
   * Performs a query to the backend to refresh the access token.
   * Updates the data in local storage.
   */
  refreshAccessToken(): void {
    // check if the tokens are already being refreshed
    if (this.refreshingTokens) {
      return;
    }
    this.refreshingTokens = true;
    // call the api to refresh the authentication info
    this.http.get<IAuthUser>(`${env.apiUrl}/auth/refresh`).subscribe({
      next: (authUser: IAuthUser) => {
        this.localStorageService.setItem(LocalStorageVars.authUser, authUser);
        this.refreshingTokens = false;
        return authUser;
      },
      error: (error) => {
        console.error(error);
        this.refreshingTokens = false;
        if (error.status === 401) {
          this.logout(false);
        }
      },
    });
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
      // if the access token is expired, check the refresh token
      if (isExpired) {
        const refreshToken = authUser.getValue()?.refreshToken;
        if (refreshToken === undefined) {
          return false;
        }
        if (!this.isJwtExpired(refreshToken)) {
          return true;
        }
        console.warn('Valid: Your session has expired, logging you out');
        this.logout();
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
