import { Component } from '@angular/core';
import { IFamilyTree, ITemplateFamilyTree } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { templates } from './templates';

@Component({
  selector: 'webstore-family-tree-template-modal',
  templateUrl: './family-tree-template-modal.component.html',
  styleUrls: ['./family-tree-template-modal.component.scss'],
})
export class FamilyTreeTemplateModalComponent {
  templateList: ITemplateFamilyTree[] = templates;

  constructor(public activeModal: NgbActiveModal, private localStorageService: LocalStorageService) {}

  /**
   * Sets the local storage design to the selected template
   * 
   * @param name 
   */
  applyTemplate(name: string) {
    const selectedTemplate: ITemplateFamilyTree = templates.find((template) => template.name === name);
    this.localStorageService.setItem<IFamilyTree>(LocalStorageVars.designFamilyTree, selectedTemplate.designProperties);
    location.reload();
  }
}
