import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateLocalStorageTransactionItem,
  CreateTransactionItemRequest,
  DesignTypeEnum,
  IDesign,
  ITransactionItem,
  UpdateTransactionItemRequest,
} from '@interfaces';
import { LocalStorageVars } from '@models';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { LocalStorageService } from '../local-storage';

@Injectable({
  providedIn: 'root',
})
export class TransactionItemService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

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
    transactionItemId: string,
    params: UpdateTransactionItemRequest
  ): Observable<ITransactionItem> {
    return this.http.put<ITransactionItem>(
      `${env.apiUrl}/transaction-items/me/${transactionItemId}`,
      params
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public deleteTransactionItem(transactionItemId: string): Observable<void> {
    return this.http.delete<void>(
      `${env.apiUrl}/transaction-items/me/${transactionItemId}`
    );
  }

  public saveToLocalStorage(data: CreateLocalStorageTransactionItem) {
    const transactionItem: ITransactionItem = {
      transactionItemId: null,
      orderId: null,
      dimension: data.dimension,
      quantity: data.quantity,
      design: {
        designId: null,
        designProperties: data.designProperties,
        designType: DesignTypeEnum.familyTree,
        user: null,
        mutable: false,
      },
    };

    this.localStorageService.setItem(
      LocalStorageVars.transactionItems,
      transactionItem
    );
  }
}
