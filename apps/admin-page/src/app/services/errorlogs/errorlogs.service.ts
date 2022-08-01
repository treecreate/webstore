import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IErrorlog } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ErrorlogsService {
  constructor(private http: HttpClient) {}

  /**
   * Fetch all errorlogs
   *
   * @returns an observable with the errorlog list.
   */
  public get(params: { name?: string; userId?: string }): Observable<IErrorlog[]> {
    const { name, userId } = params;
    if (name && userId) {
      return this.http.get<IErrorlog[]>(`${env.apiUrl}/errorlogs?name=${name}&userId=${userId}`);
    } else if (name && !userId) {
      return this.http.get<IErrorlog[]>(`${env.apiUrl}/errorlogs?name=${name}`);
    } else if (!name && userId) {
      return this.http.get<IErrorlog[]>(`${env.apiUrl}/errorlogs?userId=${userId}`);
    } else {
      return this.http.get<IErrorlog[]>(`${env.apiUrl}/errorlogs`);
    }
  }

  /**
   * Marks the given errorlog as resolved.
   * @param errorlogId the errorlog id.
   * @returns updated errorlog object.
   */
  public markAsResolved(errorlogId: string): Observable<IErrorlog> {
    return this.http.patch<IErrorlog>(`${env.apiUrl}/errorlogs/resolve/${errorlogId}`, {});
  }
}
