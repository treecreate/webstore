import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAuthUser, INewsletter } from '@interfaces';
import { LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../shared/components/toast/toast-service';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { LocalStorageService } from '../../shared/services/local-storage';
import { NewsletterService } from '../../shared/services/order/newsletter/newsletter.service';
@Component({
  selector: 'webstore-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  initialTop: 0;
  showUpArrow = false;
  showStartButton = false;
  public isLoggedIn: boolean;
  private authUser$: BehaviorSubject<IAuthUser>;
  subscribeForm: FormGroup;
  isSubscribingUser = false;

  title = 'homeComponent';

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private newsletterService: NewsletterService,
    private toastService: ToastService
  ) {
    this.initialTop = 0;

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

    this.subscribeForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  submitNewsletterEmail() {
    this.isSubscribingUser = true;
    this.newsletterService
      .registerNewsletterEmail(this.subscribeForm.get('email').value)
      .subscribe(
        (data: INewsletter) => {
          this.toastService.showAlert(
            `Thank you for subscribing: ${data.email}`,
            `Tak for din tilmelding: ${data.email}`,
            'success',
            3000
          );
          this.isSubscribingUser = false;
        },
        (error) => {
          // TODO: translate API errors to danish
          this.toastService.showAlert(
            error.error.message,
            error.error.message,
            'danger',
            100000
          );
          console.error(error);
          this.isSubscribingUser = false;
        }
      );
  }

  @HostListener('window:scroll')
  onScrollShow() {
    // For the up arrow that scrolls to top
    if (window.scrollY > 800) {
      this.showUpArrow = true;
    } else {
      this.showUpArrow = false;
    }
    // For the start button
    if (window.scrollY < 50) {
      this.showStartButton = false;
    } else if (window.scrollY < 1800) {
      this.showStartButton = true;
    } else {
      this.showStartButton = false;
    }
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
