import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { IAuthUser } from '@interfaces';
import { LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { LocalStorageService } from '../../shared/services/local-storage';
@Component({
  selector: 'webstore-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css',
    './home.component.mobile.css',
    './home.component.side-scroll.css',
  ],
})
export class HomeComponent implements OnInit {
  initialTop: 0;
  parallaxRatio: number;
  showUpArrow = false;
  public isLoggedIn: boolean;
  private authUser$: BehaviorSubject<IAuthUser>;

  title = 'homeComponent';

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private eleRef: ElementRef
  ) {
    this.initialTop = 0;
    this.parallaxRatio = 0.7;

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
  onWindowScroll() {
    // For the up arrow that scrolls to top
    if (window.scrollY > 800) {
      this.showUpArrow = true;
    } else {
      this.showUpArrow = false;
    }
    return this.initialTop - window.scrollY * this.parallaxRatio + 'px';
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    //
  }
}
