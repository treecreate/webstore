import { Component, HostListener, OnInit } from '@angular/core';
import { IAuthUser } from '@interfaces';
import { LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { LocalStorageService } from '../../shared/services/local-storage';
@Component({
  selector: 'webstore-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  initialTop: 0;
  showUpArrow = false;
  showStartButton = false;
  public isLoggedIn: boolean;
  private authUser$: BehaviorSubject<IAuthUser>;

  title = 'homeComponent';

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService
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

  onWindowScroll() {}

  scrollTop() {
    window.scrollTo(0, 0);
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
