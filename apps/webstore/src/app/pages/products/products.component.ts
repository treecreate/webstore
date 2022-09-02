import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import productsItems, { ProductsItem } from './products-items.constant';

@Component({
  selector: 'webstore-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productsList: ProductsItem[] = productsItems;

  localeCode: LocaleType;

  constructor(private localStorage: LocalStorageService, private metaTitle: Title, private meta: Meta) {
    this.localeCode = this.localStorage.getItem<LocaleType>(LocalStorageVars.locale).value;
  }

  ngOnInit(): void {
    this.setMetaData();
  }

  setMetaData() {
    this.metaTitle.setTitle('');
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ name: 'keywords', content: '' });
  }

  isEnglish(): boolean {
    return this.localeCode === LocaleType.en;
  }
}
