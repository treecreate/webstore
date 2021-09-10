import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INewsletter } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { AuthService } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  registerNewsletterEmail(email: string): Observable<INewsletter> {
    return this.http.post<INewsletter>(`${env.apiUrl}/newsletter/${email}`, {});
  }

  unsubscribe(newsletterId: string): Observable<any> {
    return this.http.delete(`${env.apiUrl}/newsletter/${newsletterId}`, {});
  }

  isSubscribed(): Observable<INewsletter> {
    const userEmail = this.authService.getAuthUser().email;
    return this.http.get<INewsletter>(`${env.apiUrl}/newsletter/me`, {});
  }
}
