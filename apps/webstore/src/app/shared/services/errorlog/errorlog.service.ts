import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IErrorlog } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { environment as env } from '../../../../environments/environment';
import { AuthService } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorlogsService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  /**
   * Create a new errorlog log entry.
   * @param name the name of the errorlog, for example 'webstore.login.login-failed'.
   * @returns the created errorlog entry.
   */
  public create(name: string, error: any): void {
    try {
      const authUser = this.authService.getAuthUser();
      const browserInfo = this.getBrowserVersion();
      const url = window.location.href;
      const production = env.production;

      // If logged in, use the actual UserId
      if (authUser) {
        this.http
          .post<IErrorlog>(`${env.apiUrl}/errorlogs`, {
            name,
            userId: authUser.userId,
            browser: browserInfo,
            url,
            production,
            error,
          })
          .subscribe();
      } else {
        // When not logged in, use a locally stored random UUID as the user Id
        const userId = this.localStorageService.getItem<string>(LocalStorageVars.eventlogLogUserId).value;
        if (userId) {
          this.http
            .post<IErrorlog>(`${env.apiUrl}/errorlogs`, {
              name,
              userId: userId,
              browser: browserInfo,
              url,
              production,
              error,
            })
            .subscribe();
        } else {
          // If userId was not present in the local storage before, create it and set it.
          const newUserId = this.createErrorlogLogUserId();
          this.localStorageService.setItem(LocalStorageVars.eventlogLogUserId, newUserId);
          this.http
            .post<IErrorlog>(`${env.apiUrl}/errorlogs`, {
              name,
              userId: authUser.userId,
              browser: browserInfo,
              url,
              production,
              error,
            })
            .subscribe();
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Generate a random UUID v4
   * @returns generated UUID
   */
  private createErrorlogLogUserId(): string {
    let uuidValue = '',
      k: number,
      randomValue: number;
    for (k = 0; k < 32; k++) {
      // eslint-disable-next-line no-bitwise
      randomValue = (Math.random() * 16) | 0;

      if (k === 8 || k === 12 || k === 16 || k === 20) {
        uuidValue += '-';
      }
      // eslint-disable-next-line no-bitwise
      uuidValue += (k === 12 ? 4 : k === 16 ? (randomValue & 3) | 8 : randomValue).toString(16);
    }
    return uuidValue;
  }

  /**
   * Get human-readable berwoser name and version infromation.
   * @returns browser name and version
   */
  private getBrowserVersion(): string {
    const userAgent = navigator.userAgent;
    let matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let temp: any[];

    if (/trident/i.test(matchTest[1])) {
      temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE ' + (temp[1] || '');
    }
    if (matchTest[1] === 'Chrome') {
      temp = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (temp != null) return temp.slice(1).join(' ').replace('OPR', 'Opera');
    }
    matchTest = matchTest[2] ? [matchTest[1], matchTest[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((temp = userAgent.match(/version\/(\d+)/i)) != null) matchTest.splice(1, 1, temp[1]);
    return matchTest.join(' ');
  }
}
