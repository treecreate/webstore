import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IAuthUser, ITransactionItem } from '@interfaces';
import { LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IEnvironment } from '../../../../environments/ienvironment';
import { AuthService } from '../../services/authentication/auth.service';
import { LocalStorageService } from '../../services/local-storage';
import { TransactionItemService } from '../../services/transaction-item/transaction-item.service';
import { VerifyService } from '../../services/verify/verify.service';
import { ToastService } from '../toast/toast-service';

@Component({
  selector: 'webstore-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  itemList: ITransactionItem[] = [];
  itemsInBasket: number; 
  public isMenuCollapsed = true;
  private authUser$: BehaviorSubject<IAuthUser>;
  public isLoggedIn: boolean;
  public isVerified: boolean;

  public locale$: BehaviorSubject<LocaleType>;
  public localeCode: LocaleType;
  public environment: IEnvironment;

  isResendVerificationEmailLoading = false;

  @ViewChild('profileMenu') profileMenu: ElementRef;
  @ViewChild('languageChange') languageChange: ElementRef;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private verifyService: VerifyService,
    private toastService: ToastService,
    private transactionItemService: TransactionItemService
  ) {
    // Listen to changes to locale
    this.locale$ = this.localStorageService.getItem<LocaleType>(
      LocalStorageVars.locale
    );
    this.localeCode = this.locale$.getValue();
    this.locale$.subscribe(() => {
      console.log('Locale changed to: ' + this.locale$.getValue());
    });
    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(
      LocalStorageVars.authUser
    );
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn =
        this.authUser$.getValue() != null &&
        this.authService.isAccessTokenValid();
    });
    // Listen to changes to verification status
    this.localStorageService
      .getItem<IAuthUser>(LocalStorageVars.authUser)
      .subscribe(() => {
        //TODO: isVerified is null, the verify service returns null
        this.isVerified = this.verifyService.getIsVerified();
      });
    this.environment = environment;
    
    //Check for items in basket if user is logged in
    this.transactionItemService.getTransactionItems().subscribe(
      (itemList: ITransactionItem[]) => {
        this.itemList = itemList;
        this.itemsInBasket = itemList.length; 
        console.log('Fetched transaction items', itemList);
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );

    
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
    this.locale$ = this.localStorageService.setItem<LocaleType>(
      LocalStorageVars.locale,
      this.localeCode
    );
  }

  logout() {
    console.log('logged out');
    this.toastService.showAlert(
      'You have now logged out!',
      'Du er nu logget ud!',
      'success',
      2500
    );
    this.authService.logout();
    window.scroll(0, 0);
  }

  resendVerificationEmail() {
    this.isResendVerificationEmailLoading = true;
    this.verifyService.sendVerificationEmail().subscribe(
      () => {
        this.toastService.showAlert(
          'A new verification e-mail has been sent. Please go to your inbox and click the verification link.',
          'Vi har sendt dig en ny e-mail. Den skal godkendes før du kan foretage køb på hjemmesiden.',
          'success',
          10000
        );
        this.isResendVerificationEmailLoading = false;
      },
      (err: HttpErrorResponse) => {
        this.toastService.showAlert(
          `Failed to send a verification email. try again later`,
          'Der skete en fejl med din email, prøv venligst igen',
          'danger',
          20000
        );
        console.log(err);
        this.isResendVerificationEmailLoading = false;
      }
    );
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

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void { }
}
