import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { LocaleType } from '../../../i18n';
import { LocalStorageService, LocalStorageVars } from '../../services/local-storage';

@Component({
  selector: 'webstore-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public isMenuCollapsed = true;
  locale$: BehaviorSubject<LocaleType>;
  localeCode: LocaleType;

  basketItemOptions(amount: Number): string {
    if (amount === 0) {
      return 'Basket empty';
    }
    return `(${amount}) products `;
  }

  constructor(private localStorageService: LocalStorageService, 
    @Inject(DOCUMENT) private document: Document) {
    this.locale$ = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale);
    this.localeCode = this.locale$.getValue();
  
    this.locale$.subscribe(() => {
      console.log('Locale changed to: ' + this.locale$.getValue());
    });
  }

  changeLocale() {
    if ( this.localeCode === LocaleType.en ){
      this.localeCode = LocaleType.dk;
    }
    else {
      this.localeCode = LocaleType.en;
    }
    
    this.locale$ = this.localStorageService.setItem<LocaleType>( LocalStorageVars.locale, this.localeCode );
  }

  ngOnInit(): void {}
}
