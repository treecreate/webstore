import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateOrderRequest, IOrder, IPaymentLink } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  public createOrder(params: CreateOrderRequest): Observable<IPaymentLink> {
    return this.http.post<IPaymentLink>(`${env.apiUrl}/orders`, params);
  }

  getOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${env.apiUrl}/orders/me`);
  }
}
