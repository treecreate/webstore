import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrder } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  public getOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${env.apiUrl}/orders`);
  }

  public updateOrder(order: IOrder): Observable<IOrder> {
    return this.http.patch<IOrder>(`${env.apiUrl}/orders/status/${order.orderId}`, { status: order.status });
  }
}
