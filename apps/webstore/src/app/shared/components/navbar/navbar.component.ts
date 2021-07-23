import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IEnvironment } from '../../../../environments/ienvironment';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage';
import { LocalStorageVars, LocaleType } from '@models';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'webstore-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public isMenuCollapsed = true;
  private authUser$: BehaviorSubject<string>;
  public isLoggedIn: boolean;

  public locale$: BehaviorSubject<LocaleType>;
  public localeCode: LocaleType;
  public environment: IEnvironment;

  basketItemOptions(amount: number): string {
    if (amount === 0) {
      return 'Basket empty';
    }
    return `(${amount}) products `;
  }

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    // Listen to changes to locale
    this.locale$ = this.localStorageService.getItem<LocaleType>(
      LocalStorageVars.locale
    );
    this.localeCode = this.locale$.getValue();

    this.locale$.subscribe(() => {
      console.log('Locale changed to: ' + this.locale$.getValue());
    });

    this.localeCode = this.locale$.getValue();

    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<string>(
      LocalStorageVars.authUser
    );

    this.authUser$.subscribe(() => {
      // If the user data is undefined, assume that the user is logged out
      this.isLoggedIn = this.authUser$.getValue() != null ? true : false;
    });

    this.environment = environment;
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

  logout() {
    this.authService.logout();
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
