import { Component } from '@angular/core';
import { IFamilyTree, Template } from '@interfaces';
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
  templateList: Template[] = templates;

  constructor(public activeModal: NgbActiveModal, private localStorageService: LocalStorageService) {}

  applyTemplate(name: string) {
    const selectedTemplate: Template = templates.find((template) => template.name === name);
    this.localStorageService.setItem<IFamilyTree>(LocalStorageVars.designFamilyTree, selectedTemplate.designProperties);
    location.reload();
  }
}
