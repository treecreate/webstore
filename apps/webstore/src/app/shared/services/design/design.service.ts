import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateDesignRequest, IDesign, UpdateDesignRequest } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DesignService {
  constructor(private http: HttpClient) {}

  public getDesigns(): Observable<IDesign[]> {
    return this.http.get<IDesign[]>(`${env.apiUrl}/designs/me`);
  }

  public getDesign(designId: string): Observable<IDesign> {
    return this.http.get<IDesign>(`${env.apiUrl}/designs/me/${designId}`);
  }

  public deleteDesign(designId: string): Observable<void> {
    return this.http.delete<void>(`${env.apiUrl}/designs/${designId}`);
  }

  public createDesign(params: CreateDesignRequest): Observable<IDesign> {
    return this.http.post<IDesign>(`${env.apiUrl}/designs`, params);
  }

  public updateDesign(params: UpdateDesignRequest): Observable<IDesign> {
    return this.http.put<IDesign>(`${env.apiUrl}/designs`, params);
  }
}
