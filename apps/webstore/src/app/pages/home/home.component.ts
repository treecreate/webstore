import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
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
  private authUser$: BehaviorSubject<string>;

  title = 'homeComponent';

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private eleRef: ElementRef
  ) {
    this.initialTop = 0;
    this.parallaxRatio = 0.7;

    this.authUser$ = this.localStorageService.getItem<string>(
      LocalStorageVars.authUser
    );

    this.authUser$.subscribe(() => {
      // TODO: refactor this logic so that it validates that the user data is correct
      // If the user data is undefined, assume that the user is logged out
      this.isLoggedIn = this.authUser$.getValue() != null ? true : false;
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
  ngOnInit(): void {}
}
