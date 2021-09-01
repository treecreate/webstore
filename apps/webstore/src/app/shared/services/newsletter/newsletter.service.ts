import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INewsletter } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  constructor(private http: HttpClient) {}

  registerNewsletterEmail(email: string): Observable<INewsletter> {
    return this.http.post<INewsletter>(`${env.apiUrl}/newsletter/${email}`, {});
  }

  unsubscribe(newsletterId: string): Observable<any> {
    return this.http.delete(`${env.apiUrl}/newsletter/${newsletterId}`, {});
  }
}
