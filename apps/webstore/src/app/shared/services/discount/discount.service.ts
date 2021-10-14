import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDiscount } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor(private http: HttpClient) { }

  getDiscount(discountCode: string): Observable<IDiscount> {
    return this.http.get<IDiscount>(`${env.apiUrl}/discounts/${discountCode}`)
  }

  useDiscount(discountId: string): Observable<IDiscount> {
    return this.http.put<IDiscount>(`${env.apiUrl}/discounts/use/${discountId}`, {}); 
  }
}
