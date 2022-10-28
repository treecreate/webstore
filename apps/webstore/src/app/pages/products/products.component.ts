import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
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
    this.metaTitle.setTitle('Giv en personlig og miljøvenlig gave i høj kvalitet');
    this.meta.updateTag({
      name: 'description',
      content:
        'Køb årets bedste gave nu! Hos Treecreate får du altid træ i den bedste kvalitet, og kun fra bæredygtige kilder.',
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'Træ, kvalitet, træskilt, skilt i træ, julegave, 2022, 2023, gave',
    });
  }

  isEnglish(): boolean {
    return this.localeCode === LocaleType.en;
  }
}
