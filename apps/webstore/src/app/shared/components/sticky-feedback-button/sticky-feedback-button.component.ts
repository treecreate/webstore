import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackModalComponent } from '../modals/feedback-modal/feedback-modal.component';

@Component({
  selector: 'webstore-sticky-feedback-button',
  templateUrl: './sticky-feedback-button.component.html',
  styleUrls: ['./sticky-feedback-button.component.scss'],
})
export class StickyFeedbackButtonComponent {
  public isSubscribed = true;
  public isLoggedIn = false;

  constructor(private modalService: NgbModal) {}

  openfeedbackModal() {
    this.modalService.open(FeedbackModalComponent);
  }
}
