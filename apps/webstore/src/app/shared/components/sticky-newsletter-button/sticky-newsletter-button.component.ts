import { Component } from '@angular/core';
import { LocalStorageService } from '@local-storage';
import { CookieStatus, LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsletterSignupModalComponent } from '../modals/newsletter-signup-modal/newsletter-signup-modal.component';

@Component({
  selector: 'webstore-sticky-newsletter-button',
  templateUrl: './sticky-newsletter-button.component.html',
  styleUrls: ['./sticky-newsletter-button.component.scss'],
})
export class StickyNewsletterButtonComponent {
  public isSubscribed = true;
  public isLoggedIn = false;
  public isCookiePromptShow = false;
  private cookiePrompt = document.getElementById('cookiePromptModal');
  public cookiePromptHeight: number;

  constructor(private modalService: NgbModal, private localStorageService: LocalStorageService) {
    // see if cookies have been accepted/denied
    this.localStorageService.getItem(LocalStorageVars.cookiesAccepted).subscribe(() => {
      if (!this.localStorageService.getItem(LocalStorageVars.cookiesAccepted).value !== undefined) {
        console.log('not accepted');
        this.isCookiePromptShow = true;
        this.cookiePromptHeight = this.cookiePrompt.offsetHeight + 16;
      } else {
        console.log('accepted');
        this.isCookiePromptShow = false;
        this.cookiePromptHeight = 16;
      }
    });
  }

  openNewsletterModal() {
    this.modalService.open(NewsletterSignupModalComponent);
  }
}
