import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { CatalogItem } from '../catalogItems';

@Component({
  selector: 'webstore-product-display',
  templateUrl: './product-display.component.html',
  styleUrls: ['./product-display.component.scss'],
})
export class ProductDisplayComponent {
  @Input()
  product!: CatalogItem;

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
