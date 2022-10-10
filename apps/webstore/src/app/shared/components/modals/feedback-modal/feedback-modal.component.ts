import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: [
    './feedback-modal.component.css',
    '../../../../../assets/styles/modals.css',
    '../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class FeedbackModalComponent implements OnInit {
  title = 'FeedbackModal';

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    return;
  }
}
