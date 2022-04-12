import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUpdateOrderRequest, INewsletter, IOrder, OrderStatusEnum } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  constructor(private http: HttpClient) {}

  /**
   * Calls the API to fetch a specific newsletter entry.
   *
   * @param email the email of the newsletter entry
   * @returns an observable with the newsletter object.
   */
  public getNewsletter(email: string): Observable<INewsletter> {
    return this.http.get<INewsletter>(`${env.apiUrl}/newsletter/${email}`);
  }
}
