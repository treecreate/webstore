import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRegisterFeedbackRequest } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private http: HttpClient) {}

  /**
   * Created as feedback entry in the system.
   * @param params feedback information
   * @returns the result of the query. No actual response data outside of the status.
   */
  registerFeedback(params: IRegisterFeedbackRequest): Observable<void> {
    return this.http.post<void>(`${env.apiUrl}/feedback`, params);
  }
}
