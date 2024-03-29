import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-family-tree-intro-modal',
  templateUrl: './family-tree-intro-modal.component.html',
  styleUrls: ['./family-tree-intro-modal.component.css'],
})
export class FamilyTreeIntroModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
