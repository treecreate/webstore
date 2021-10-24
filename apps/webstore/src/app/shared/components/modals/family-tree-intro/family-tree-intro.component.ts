import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-famili-tree-intro',
  templateUrl: './family-tree-intro.component.html',
  styleUrls: ['./family-tree-intro.component.css'],
})
export class FamilyTreeIntroComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}
