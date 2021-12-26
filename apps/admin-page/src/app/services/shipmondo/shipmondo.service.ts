import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShipmondoService {

  constructor(private http: HttpClient) {}

     public createOrder(orderInfo: Object): Observable<Object> {
       return this.http.post<Object>(`${environment.apiUrl}/shipmondo/create-shipment`, orderInfo);
    }
}
