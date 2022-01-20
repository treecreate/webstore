import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateSHipmentRequest } from '@interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShipmondoService {
  constructor(private http: HttpClient) {}

  public createOrder(orderInfo: CreateSHipmentRequest): Observable<unknown> {
    return this.http.post<unknown>(`${environment.apiUrl}/shipmondo/create-shipment`, orderInfo);
  }
}
