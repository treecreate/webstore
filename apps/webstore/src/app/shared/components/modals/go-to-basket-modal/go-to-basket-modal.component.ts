import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-go-to-basket-modal',
  templateUrl: './go-to-basket-modal.component.html',
  styleUrls: ['./go-to-basket-modal.component.css'],
})
export class GoToBasketModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
