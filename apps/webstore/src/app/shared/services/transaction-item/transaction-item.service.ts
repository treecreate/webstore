import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateTransactionItemRequest,
  ITransactionItem,
  UpdateTransactionItemRequest,
} from '@interfaces';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionItemService {
  constructor(private http: HttpClient) {}

  public getTransactionItems(): Observable<ITransactionItem[]> {
    return this.http.get<ITransactionItem[]>(
      `${env.apiUrl}/transaction-items/me`
    );
  }
  public getTransactionItem(
    transactionItemId: string
  ): Observable<ITransactionItem> {
    return this.http.get<ITransactionItem>(
      `${env.apiUrl}/transaction-items/me/${transactionItemId}`
    );
  }

  public createTransactionItem(
    params: CreateTransactionItemRequest
  ): Observable<ITransactionItem> {
    return this.http.post<ITransactionItem>(
      `${env.apiUrl}/transaction-items/me`,
      params
    );
  }

  public updateTransactionItem(
    params: UpdateTransactionItemRequest
  ): Observable<ITransactionItem> {
    return this.http.put<ITransactionItem>(
      `${env.apiUrl}/transaction-items/me`,
      params
    );
  }
}
