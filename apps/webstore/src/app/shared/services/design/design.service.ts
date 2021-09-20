import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDesign } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DesignService {
  constructor(private http: HttpClient) {}

  public getDesign(designId: string): Observable<IDesign> {
    return this.http.get<IDesign>(`${env.apiUrl}/designs/me/${designId}`);
  }
}
