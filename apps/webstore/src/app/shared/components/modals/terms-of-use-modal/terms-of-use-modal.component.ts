import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from '../../../services/events/events.service';

@Component({
  selector: 'webstore-terms-of-use-modal',
  templateUrl: './terms-of-use-modal.component.html',
  styleUrls: ['./terms-of-use-modal.component.css', '../../../../../assets/styles/terms-and-conditions.css'],
})
export class TermsOfUseModalComponent {
  constructor(public activeModal: NgbActiveModal, private eventsService: EventsService) {
    this.eventsService.create('webstore.terms-of-use-modal.viewed');
  }
}
