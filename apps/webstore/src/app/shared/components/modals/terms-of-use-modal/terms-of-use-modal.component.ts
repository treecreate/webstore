import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-terms-of-use-modal',
  templateUrl: './terms-of-use-modal.component.html',
  styleUrls: [
    './terms-of-use-modal.component.css',
    '../../../../../assets/styles/terms-and-conditions.css',
  ],
})
export class TermsOfUseModalComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}
