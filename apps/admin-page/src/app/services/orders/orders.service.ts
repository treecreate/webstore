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

  /**
   * Calls the API to fetch all available orders.
   *
   * @returns an observable with the list of orders.
   */
  public getOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${env.apiUrl}/orders`);
  }

  /**
   * Calls the API to update the status of an order.
   *
   * @param order - the order that needs to be updated.
   * @returns an observable with the updated order.
   */
  public updateOrder(order: IOrder): Observable<IOrder> {
    return this.http.patch<IOrder>(`${env.apiUrl}/orders/status/${order.orderId}`, { status: order.status });
  }
}
