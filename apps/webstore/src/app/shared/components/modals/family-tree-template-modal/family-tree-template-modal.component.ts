import { Component } from '@angular/core';
import { TreeDesignEnum } from '@assets';
import { FamilyTreeFontEnum, IFamilyTree, Template } from '@interfaces';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-family-tree-template-modal',
  templateUrl: './family-tree-template-modal.component.html',
  styleUrls: ['./family-tree-template-modal.component.scss'],
})
export class FamilyTreeTemplateModalComponent {
  templateList: Template[] = [
    { 
      title: 'first template', 
      designProperties: {
        font: FamilyTreeFontEnum.argestadisplay,
        backgroundTreeDesign: TreeDesignEnum.tree1,
        boxSize: 30,
        banner: undefined,
        boxes: [
          
        ]
      }, 
      url: '/first' 
    },
    { 
      title: 'second template', 
      designProperties: {
        font: FamilyTreeFontEnum.argestadisplay,
        backgroundTreeDesign: TreeDesignEnum.tree1,
        boxSize: 30,
        banner: undefined,
        boxes: [

        ]
      }, 
      url: '/second' 
    },
  ];

  // font: FamilyTreeFontEnum;
  // backgroundTreeDesign: TreeDesignEnum;
  // boxSize: number;
  // banner: IFamilyTreeBanner;
  // boxes: IDraggableBox[];
  // 

  constructor(public activeModal: NgbActiveModal) {}

  applyTemplate(url: string) {
    alert(url);
  }
}
