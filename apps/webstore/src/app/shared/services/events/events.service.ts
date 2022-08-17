import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorlogPriorityEnum, IEvent } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
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

      // If logged in, use the actual UserId
      if (authUser != null && this.authService.isAccessTokenValid()) {
        this.http
          .post<IEvent>(`${env.apiUrl}/events`, {
            name,
            userId: authUser.userId,
          })
          .subscribe();
      } else {
        // When not logged in, use a locally stored random UUID as the user Id
        const userId = this.localStorageService.getItem<string>(LocalStorageVars.eventLogUserId).value;
        if (userId) {
          this.http
            .post<IEvent>(`${env.apiUrl}/events`, {
              name,
              userId: userId,
            })
            .subscribe();
        } else {
          // If userId was not present in the local storage before, create it and set it.
          const newUserId = this.createEventLogUserId();
          this.localStorageService.setItem(LocalStorageVars.eventLogUserId, newUserId);
          this.http
            .post<IEvent>(`${env.apiUrl}/events`, {
              name,
              userId: newUserId,
            })
            .subscribe();
        }
      }
    } catch (err) {
      console.error(err);
      this.errorlogsService.create('webstore.event-logs.failed-to-log', ErrorlogPriorityEnum.high, {
        name: 'webstore.error-logs.failed-to-log',
        userId: '00000000-0000-0000-0000-000000000000',
        error: err,
      });
    }
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
}
