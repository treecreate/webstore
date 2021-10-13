import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-terms-of-sale-modal',
  templateUrl: './terms-of-sale-modal.component.html',
  styleUrls: [
    './terms-of-sale-modal.component.css',
    '../../../../../assets/styles/terms-and-conditions.css',
  ],
})
export class TermsOfSaleModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
