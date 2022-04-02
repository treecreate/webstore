import { Component } from '@angular/core';
import { CatalogItem } from './catalogItems';
import catalogItems from './catalogItems';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'webstore-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent {
  catalogList: CatalogItem[] = catalogItems;

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
