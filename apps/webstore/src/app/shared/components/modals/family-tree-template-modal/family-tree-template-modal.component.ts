import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { IFamilyTree, ITemplateFamilyTree } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { templates } from './templates';
import { templateExtra } from './templatesExtra';

@Component({
  selector: 'webstore-family-tree-template-modal',
  templateUrl: './family-tree-template-modal.component.html',
  styleUrls: ['./family-tree-template-modal.component.scss'],
})
export class FamilyTreeTemplateModalComponent {
  templateList: ITemplateFamilyTree[];

  constructor(
    public activeModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.returnTemplateList();
  }

  /**
   * Sets the local storage design to the selected template
   *
   * @param name
   */
  applyTemplate(name: string) {
    const selectedTemplate: ITemplateFamilyTree = templates.find((template) => template.name === name);
    console.log(selectedTemplate.designProperties);
    this.localStorageService.setItem<IFamilyTree>(LocalStorageVars.designFamilyTree, selectedTemplate.designProperties);
    this.router.navigate(['/product']);
    location.reload();
  }

  returnTemplateList() {
    this.templateList = this.templateList === templates ? templates.concat(templateExtra) : templates;
  }
}
