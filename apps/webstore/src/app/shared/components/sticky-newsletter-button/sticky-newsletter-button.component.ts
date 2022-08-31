import { Component, OnInit } from '@angular/core';
import { IAuthUser, INewsletter } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/authentication/auth.service';
import { NewsletterService } from '../../services/newsletter/newsletter.service';
import { NewsletterSignupModalComponent } from '../modals/newsletter-signup-modal/newsletter-signup-modal.component';

@Component({
  selector: 'webstore-sticky-newsletter-button',
  templateUrl: './sticky-newsletter-button.component.html',
  styleUrls: ['./sticky-newsletter-button.component.scss'],
})
export class StickyNewsletterButtonComponent {
  
  private authUser$: BehaviorSubject<IAuthUser>;
  public isSubscribed: Boolean = true; 
  public isLoggedIn = false;

  constructor(
    private modalService: NgbModal,
  ) {
    
  }

  openNewsletterModal() {
    this.modalService.open(NewsletterSignupModalComponent);
  }
}
