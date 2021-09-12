import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IAuthUser } from '@interfaces';
import { LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IEnvironment } from '../../../../environments/ienvironment';
import { AuthService } from '../../services/authentication/auth.service';
import { LocalStorageService } from '../../services/local-storage';
import { VerifyService } from '../../services/verify/verify.service';
import { ToastService } from '../toast/toast-service';

@Component({
  selector: 'webstore-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public isMenuCollapsed = true;
  private authUser$: BehaviorSubject<IAuthUser>;
  public isLoggedIn: boolean;
  public isVerified: boolean;

  public locale$: BehaviorSubject<LocaleType>;
  public localeCode: LocaleType;
  public environment: IEnvironment;

  basketItems = [{ number: 1 }, { number: 1 }];

  isResendVerificationEmailLoading = false;

  @ViewChild('profileMenu') profileMenu: ElementRef;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private verifyService: VerifyService,
    private toastService: ToastService
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
        this.isVerified = this.verifyService.getIsVerified();
      });

    this.environment = environment;
  }

  changeLocale() {
    // TODO: make the change language alert show on screen after reload
    if (this.localeCode === LocaleType.en) {
      this.localeCode = LocaleType.dk;
      this.toastService.showAlert(
        '',
        'Sprog skiftet til: Dansk',
        'success',
        2500
      );
    } else {
      this.localeCode = LocaleType.en;
      this.toastService.showAlert(
        'Change language to: English',
        '',
        'success',
        2500
      );
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

  hideProfileMenu() {
    this.profileMenu.nativeElement.classList.remove('show');
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
