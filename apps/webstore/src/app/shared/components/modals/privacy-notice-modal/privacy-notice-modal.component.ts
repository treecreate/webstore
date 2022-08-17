import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from '../../../services/events/events.service';

@Component({
  selector: 'webstore-privacy-notice-modal',
  templateUrl: './privacy-notice-modal.component.html',
  styleUrls: ['./privacy-notice-modal.component.css', '../../../../../assets/styles/terms-and-conditions.css'],
})
export class PrivacyNoticeModalComponent {
  constructor(public activeModal: NgbActiveModal, private eventsService: EventsService) {
    this.eventsService.create('webstore.privacy-notice-modal.viewed');
  }
}
