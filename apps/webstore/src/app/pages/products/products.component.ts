import { Component } from '@angular/core';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import productsItems, { ProductsItem } from './products-items.constant';

@Component({
  selector: 'webstore-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  productsList: ProductsItem[] = productsItems;

  localeCode: LocaleType;

  constructor(private localStorage: LocalStorageService) {
    this.localeCode = this.localStorage.getItem<LocaleType>(LocalStorageVars.locale).value;
  }

  isEnglish(): boolean {
    return this.localeCode === LocaleType.en;
  }
}
