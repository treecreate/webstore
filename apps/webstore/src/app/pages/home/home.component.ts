import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAuthUser } from '@interfaces';
import { LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { LocalStorageService } from '@local-storage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsletterSignupModalComponent } from '../../shared/components/modals/newsletter-signup-modal/newsletter-signup-modal.component';

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
  subscribeForm: FormGroup;
  isSubscribingUser = false;

  title = 'homeComponent';

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
    this.initialTop = 0;

    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);

    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn = this.authUser$.getValue() != null && this.authService.isAccessTokenValid();
    });

    this.subscribeForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit(): void {
    const hasSeenNewsletterModal = this.localStorageService.getItem<boolean>(LocalStorageVars.hasSeenNewsletterModal);
    if (!hasSeenNewsletterModal.value) {
      setTimeout(() => {
        this.modalService.open(NewsletterSignupModalComponent);
        this.localStorageService.setItem<boolean>(LocalStorageVars.hasSeenNewsletterModal, true);
      }, 5000);
    }
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
