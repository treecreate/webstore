import { Component } from '@angular/core';
import { ProductsItem } from './productsItems';
import productsItems from './productsItems';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'webstore-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  productsList: ProductsItem[] = productsItems;

  locale$: BehaviorSubject<LocaleType>;
  localeCode: LocaleType;

  constructor(private localStorage: LocalStorageService) {
    this.locale$ = this.localStorage.getItem<LocaleType>(LocalStorageVars.locale);
    this.localeCode = this.locale$.getValue();
  }

  isEnglish(): boolean {
    return this.localeCode === 'en-US';
  }
}
