import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorlogPriorityEnum, IEvent } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { environment as env } from '../../../../environments/environment';
import { AuthService } from '../authentication/auth.service';
import { ErrorlogsService } from '../errorlog/errorlog.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private errorlogsService: ErrorlogsService
  ) {}

  /**
   * Create a new event log entry.
   * @param name the name of the event, for example 'webstore.cookies-accepted'.
   * @returns the created event entry.
   */
  public create(name: string): void {
    try {
      const authUser = this.authService.getAuthUser();
      const browserInfo = this.getBrowserVersion();
      const url = window.location.href;
      const locale = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).getValue();
      const isMobile = navigator.maxTouchPoints !== 0;

      // If logged in, use the actual UserId
      if (authUser != null && this.authService.isAccessTokenValid()) {
        this.http
          .post<IEvent>(`${env.apiUrl}/events`, {
            name,
            userId: authUser.userId,
            url,
            browser: browserInfo,
            locale: locale,
            isMobile: isMobile,
            isLoggedIn: true,
          })
          .subscribe({
            error: (err) => {
              this.handleFailedEventCreation(err);
            },
          });
      } else {
        // When not logged in, use a locally stored random UUID as the user Id
        const userId = this.localStorageService.getItem<string>(LocalStorageVars.eventLogUserId).value;
        if (userId) {
          this.http
            .post<IEvent>(`${env.apiUrl}/events`, {
              name,
              userId: userId,
              url,
              browser: browserInfo,
              locale: locale,
              isMobile: isMobile,
              isLoggedIn: false,
            })
            .subscribe({
              error: (err) => {
                this.handleFailedEventCreation(err);
              },
            });
        } else {
          // If userId was not present in the local storage before, create it and set it.
          const newUserId = this.createEventLogUserId();
          this.localStorageService.setItem(LocalStorageVars.eventLogUserId, newUserId);
          this.http
            .post<IEvent>(`${env.apiUrl}/events`, {
              name,
              userId: newUserId,
              url,
              browser: browserInfo,
              locale: locale,
              isMobile: isMobile,
              isLoggedIn: false,
            })
            .subscribe({
              error: (err) => {
                this.handleFailedEventCreation(err);
              },
            });
        }
      }
    } catch (err) {
      this.handleFailedEventCreation(err);
    }
  }

  handleFailedEventCreation(err): void {
    this.errorlogsService.create('webstore.event-logs.failed-to-log', ErrorlogPriorityEnum.high, {
      name: 'webstore.error-logs.failed-to-log',
      userId: '00000000-0000-0000-0000-000000000000',
      error: err,
    });
  }

  /**
   * Generate a random UUID v4
   * @returns generated UUID
   */
  private createEventLogUserId(): string {
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
   * Get human-readable browser name and version infromation.
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
