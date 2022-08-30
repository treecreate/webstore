import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateCustomOrderRequest, CreateOrderRequest, IOrder, IPaymentLink } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  public createOrder(params: CreateOrderRequest): Observable<IPaymentLink> {
    let locale = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).value;
    if (locale === null) {
      locale = LocaleType.da;
    }
    return this.http.post<IPaymentLink>(`${env.apiUrl}/orders?lang=${locale}`, params);
  }

  public getOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${env.apiUrl}/orders/me`);
  }

  /**
   * Send custom order information to the backend for processing
   * @param params custom order information
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public createCustomOrder(params: CreateCustomOrderRequest): Observable<void> {
    const formData = new FormData();
    formData.append('name', params.name);
    formData.append('email', params.email);
    formData.append('description', params.description);
    Object.values(params.files).forEach((file) => {
      formData.append('images', file);
    });
    return this.http.post<void>(`${env.apiUrl}/orders/custom`, formData);
  }
}
