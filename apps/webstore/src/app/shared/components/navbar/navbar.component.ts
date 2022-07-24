import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthUser, ITransactionItem } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IEnvironment } from '../../../../environments/ienvironment';
import { AuthService } from '../../services/authentication/auth.service';
import { TransactionItemService } from '../../services/transaction-item/transaction-item.service';
import { ToastService } from '../toast/toast-service';

@Component({
  selector: 'webstore-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  private authUser$: BehaviorSubject<IAuthUser>;
  public isLoggedIn: boolean;
  public isMenuCollapsed = true;
  public locale$: BehaviorSubject<LocaleType>;
  public localeCode: LocaleType;
  public environment: IEnvironment;

  itemList: ITransactionItem[] = [];
  itemsInBasket = 0;

  @ViewChild('profileMenu') profileMenu: ElementRef;
  @ViewChild('languageChange') languageChange: ElementRef;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private toastService: ToastService,
    private transactionItemService: TransactionItemService,
    public router: Router
  ) {
    // Listen to changes to locale
    this.locale$ = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale);
    this.localeCode = this.locale$.getValue();
    this.locale$.subscribe(() => {
      console.log('Locale changed to: ' + this.locale$.getValue());
    });
    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn = this.authUser$.getValue() != null && this.authService.isAccessTokenValid();
    });
    this.environment = environment;
    console.log(router.url);
    
  }

  changeLocale(language: string) {
    switch (language) {
      case 'dk':
        this.localeCode = LocaleType.dk;
        break;
      case 'en':
        this.localeCode = LocaleType.en;
        break;
    }
    this.locale$ = this.localStorageService.setItem<LocaleType>(LocalStorageVars.locale, this.localeCode);
  }

  getItemsInBasket() {
    if (this.isLoggedIn) {
      this.transactionItemService.getTransactionItems().subscribe(
        (itemList: ITransactionItem[]) => {
          let sum = 0;
          for (let i = 0; i < itemList.length; i++) {
            sum += itemList[i].quantity;
          }
          this.itemsInBasket = sum;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
    } else {
      const localStorageItemsList = this.localStorageService.getItem<ITransactionItem[]>(
        LocalStorageVars.transactionItems
      ).value;
      if (localStorageItemsList !== null) {
        this.itemsInBasket = localStorageItemsList.length;
      } else {
        this.itemsInBasket = 0;
      }
    }
  }

  /**
   * Remove the logged in user information from local storage and API
   */
  logout() {
    this.toastService.showAlert('You have now logged out!', 'Du er nu logget ud!', 'success', 2500);
    this.authService.logout();
  }

  autoCollapse() {
    if (window.innerWidth < 992) {
      this.isMenuCollapsed = true;
    }
    this.scrollTop();
  }

  scrollTop() {
    window.scroll(0, 0);
  }

  isEnglish() {
    return this.localeCode === LocaleType.en;
  }

  isDanish() {
    return this.localeCode === LocaleType.dk;
  }

  showProfileMenu() {
    this.profileMenu.nativeElement.classList.add('show');
  }

  showLanguageChange() {
    this.languageChange.nativeElement.classList.add('show');
  }

  hideLanguageChange() {
    this.languageChange.nativeElement.classList.remove('show');
  }

  hideProfileMenu() {
    this.profileMenu.nativeElement.classList.remove('show');
  }

  ngOnInit(): void {
    this.getItemsInBasket();
  }
}
