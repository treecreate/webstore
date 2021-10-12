import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-privacy-notice-modal',
  templateUrl: './privacy-notice-modal.component.html',
  styleUrls: [
    './privacy-notice-modal.component.css',
    '../../../../../assets/styles/terms-and-conditions.css',
  ],
})
export class PrivacyNoticeModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
