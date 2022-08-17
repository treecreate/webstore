import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvent } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(private http: HttpClient) {}

  /**
   * Fetch all events
   *
   * @returns an observable with the event list.
   */
  public get(params: { name?: string; userId?: string }): Observable<IEvent[]> {
    const { name, userId } = params;
    if (name && userId) {
      return this.http.get<IEvent[]>(`${env.apiUrl}/events?name=${name}&userId=${userId}`);
    } else if (name && !userId) {
      return this.http.get<IEvent[]>(`${env.apiUrl}/events?name=${name}`);
    } else if (!name && userId) {
      return this.http.get<IEvent[]>(`${env.apiUrl}/events?userId=${userId}`);
    } else {
      return this.http.get<IEvent[]>(`${env.apiUrl}/events`);
    }
  }
}
