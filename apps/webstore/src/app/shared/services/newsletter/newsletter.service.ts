import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INewsletter } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  registerNewsletterEmail(email: string): Observable<INewsletter> {
    let locale = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).value;
    if (locale === null) {
      locale = LocaleType.da;
    }
    return this.http.post<INewsletter>(`${env.apiUrl}/newsletter/${email}?lang=${locale}`, {});
  }

  unsubscribe(newsletterId: string): Observable<void> {
    return this.http.delete<void>(`${env.apiUrl}/newsletter/${newsletterId}`, {});
  }

  isSubscribed(): Observable<INewsletter> {
    return this.http.get<INewsletter>(`${env.apiUrl}/newsletter/me`, {});
  }
}
