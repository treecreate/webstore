import { Component } from '@angular/core';
import { BoxDesignEnum, TreeDesignEnum } from '@assets';
import { FamilyTreeFontEnum, IDraggableBox, IFamilyTree, Template } from '@interfaces';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { templateList } from './templates';

@Component({
  selector: 'webstore-family-tree-template-modal',
  templateUrl: './family-tree-template-modal.component.html',
  styleUrls: ['./family-tree-template-modal.component.scss'],
})
export class FamilyTreeTemplateModalComponent {
  templateList: Template[] = [
    templateList.twoGenerations,
    templateList.threeGenerations,
    templateList.fourGenerations,
    templateList.friendTree,
    templateList.partnerTree,
  ];

  constructor(public activeModal: NgbActiveModal) {}

  applyTemplate(name: string) {
    alert(name);
  }
}
