import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDiscount } from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DiscountsService {
  constructor(private http: HttpClient) {}

  /**
   * Calls the API to fetch all available discounts.
   *
   * @returns an observable with the list of discounts.
   */
  public getDiscounts(): Observable<IDiscount[]> {
    return this.http.get<IDiscount[]>(`${env.apiUrl}/discounts`);
  }

  /**
   * Calls the API to fetch a discount by ID.
   * 
   * @param id - the ID of the discount.
   * @returns an observable with the requested discount.
   */
  public getDiscountById(id: string): Observable<IDiscount> {
    return this.http.get<IDiscount>(`${env.apiUrl}/discounts/${id}/id`)
  }
}
