import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INewsletter } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  constructor(private http: HttpClient) {}

  /**
   * Fetch all newsletters
   *
   * @returns an observable with the newsletter list.
   */
  public getNewsletters(): Observable<INewsletter[]> {
    return this.http.get<INewsletter[]>(`${env.apiUrl}/newsletter`);
  }

  /**
   * Fetch a specific newsletter entry.
   *
   * @param email the email of the newsletter entry
   * @returns an observable with the newsletter object.
   */
  public getNewsletter(email: string): Observable<INewsletter> {
    return this.http.get<INewsletter>(`${env.apiUrl}/newsletter/${email}`);
  }

  /**
   * Remove the given newsletter entry.
   * @param newsletterId id of the newsletter entry.
   * @returns observable of the confirmation response.
   */
  unsubscribe(newsletterId: string): Observable<void> {
    return this.http.delete<void>(`${env.apiUrl}/newsletter/${newsletterId}`, {});
  }
}
