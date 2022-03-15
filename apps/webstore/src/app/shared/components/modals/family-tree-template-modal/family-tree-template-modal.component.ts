import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  showMoreExamples = false;

  /**
   * @param activeModal
   * @param localStorageService
   * @param router
   */
  constructor(
    public activeModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.returnTemplateList();
  }

  /**
   * Sets the local storage design to the selected template
   *
   * @param name describes the templates name
   */
  applyTemplate(name: string): void {
    const selectedTemplate: ITemplateFamilyTree = templates
      .concat(templateExtra)
      .find((template) => template.name === name);
    console.log(selectedTemplate.designProperties);
    this.localStorageService.setItem<IFamilyTree>(LocalStorageVars.designFamilyTree, selectedTemplate.designProperties);
    if (this.activatedRoute.snapshot.queryParams.designId !== undefined) {
      this.router.navigate(['/product']);
      this.activeModal.close();
    } else {
      location.reload();
    }
  }

  /**
   * Returns a larger template list (a list containing all)
   */
  returnTemplateList(): void {
    this.showMoreExamples = !this.showMoreExamples;
    this.templateList = this.showMoreExamples ? templates : templates.concat(templateExtra);
  }
}
