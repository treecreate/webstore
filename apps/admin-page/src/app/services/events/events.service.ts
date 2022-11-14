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

  /**
   * Get a breakdown of recent usage of the website, based on the events.
   * @param duration param to specify how many minutes of history you want. Integer. Suggested: 10
   * @param intevral param to specify in what second intervals should the data be grouped and reported. Integer. Sugested: 10
   * @returns a list of recent usage data.
   */
  public getRecentUsers(duration: number, interval: number): Observable<[{ createdAt: string; count: number }]> {
    return this.http.get<[{ createdAt: string; count: number }]>(
      `${env.apiUrl}/events/recent-users?duration=${duration}&interval=${interval}`
    );
  }
}
