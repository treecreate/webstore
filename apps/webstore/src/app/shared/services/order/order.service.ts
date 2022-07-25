import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateCustomOrderRequest, CreateOrderRequest, IOrder, IPaymentLink } from '@interfaces';
import { Observable, of } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  public createOrder(params: CreateOrderRequest): Observable<IPaymentLink> {
    return this.http.post<IPaymentLink>(`${env.apiUrl}/orders`, params);
  }

  public getOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${env.apiUrl}/orders/me`);
  }

  /**
   * Send custom order information to the backend for processing
   * @param params custom order information
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public createCustomOrder(params: CreateCustomOrderRequest): Observable<{}> {
    console.warn('NOT IMPLEMENTED - Create Custom Order API request', params);
    return of({});
  }
}
