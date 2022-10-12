import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from '../../services/events/events.service';
import { FeedbackModalComponent } from '../modals/feedback-modal/feedback-modal.component';

@Component({
  selector: 'webstore-sticky-feedback-button',
  templateUrl: './sticky-feedback-button.component.html',
  styleUrls: ['./sticky-feedback-button.component.scss'],
})
export class StickyFeedbackButtonComponent {
  public isSubscribed = true;
  public isLoggedIn = false;

  constructor(private eventsService: EventsService, private modalService: NgbModal) {}

  openfeedbackModal() {
    this.modalService.open(FeedbackModalComponent);
    this.eventsService.create(`webstore.feedback-sticky-button.clicked`);
  }
}
