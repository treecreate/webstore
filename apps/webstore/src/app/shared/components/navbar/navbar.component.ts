import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IEnvironment } from '../../../../environments/ienvironment';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage';
import { LocalStorageVars, LocaleType } from '@models';

@Component({
  selector: 'webstore-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public isMenuCollapsed = true;
  public isLoggedIn = true;
  public locale$: BehaviorSubject<LocaleType>;
  public localeCode: LocaleType;
  public environment: IEnvironment;

  basketItemOptions(amount: number): string {
    if (amount === 0) {
      return 'Basket empty';
    }
    return `(${amount}) products `;
  }

  constructor(private localStorageService: LocalStorageService) {
    this.locale$ = this.localStorageService.getItem<LocaleType>(
      LocalStorageVars.locale
    );
    this.localeCode = this.locale$.getValue();
    this.environment = environment;

    this.locale$.subscribe(() => {
      console.log('Locale changed to: ' + this.locale$.getValue());
    });
  }

  changeLocale() {
    if (this.localeCode === LocaleType.en) {
      this.localeCode = LocaleType.dk;
    } else {
      this.localeCode = LocaleType.en;
    }

    this.locale$ = this.localStorageService.setItem<LocaleType>(
      LocalStorageVars.locale,
      this.localeCode
    );
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
