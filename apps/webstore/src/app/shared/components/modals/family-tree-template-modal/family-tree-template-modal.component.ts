import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFamilyTree, ITemplateFamilyTree } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from '../../../services/events/events.service';
import { templates } from './templates';

@Component({
  selector: 'webstore-family-tree-template-modal',
  templateUrl: './family-tree-template-modal.component.html',
  styleUrls: ['./family-tree-template-modal.component.scss', '../../../../../assets/styles/terms-and-conditions.css'],
})
export class FamilyTreeTemplateModalComponent {
  templateList: ITemplateFamilyTree[] = templates;

  /**
   * @param activeModal
   * @param localStorageService
   * @param router
   */
  constructor(
    public activeModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventsService: EventsService
  ) {}

  /**
   * Sets the local storage design to the selected template
   *
   * @param name describes the templates name
   */
  applyTemplate(name: string): void {
    const selectedTemplate: ITemplateFamilyTree = templates.find((template) => template.name === name);
    this.localStorageService.setItem<IFamilyTree>(LocalStorageVars.designFamilyTree, selectedTemplate.designProperties);
    this.eventsService.create(`webstore.family-tree-template-modal.applied-template.${name}`);
    if (this.activatedRoute.snapshot.queryParams.designId !== undefined) {
      this.router.navigate(['/products/family-tree']);
      this.activeModal.close();
    } else {
      location.reload();
    }
  }
}
