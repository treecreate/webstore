import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IQoutable, IQuotableTemplate, QuotableTypeEnum } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from '../../../services/events/events.service';
import { quotableTemplateList } from './quotable-template-list';

@Component({
  selector: 'webstore-quotable-template-modal',
  templateUrl: './quotable-template-modal.component.html',
  styleUrls: ['./quotable-template-modal.component.scss', '../../../../../assets/styles/terms-and-conditions.css'],
})
export class QuotableTemplateModalComponent implements OnInit {
  @Input()
  quotableType!: QuotableTypeEnum;

  templateList: IQuotableTemplate[];

  constructor(
    private localStorageService: LocalStorageService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private eventsService: EventsService
  ) {}

  ngOnInit() {
    // Set templates to display based of quotable type
    this.templateList = quotableTemplateList.filter((template) => template.type === this.quotableType);
  }

  applyTemplate(templateName: string): void {
    const template: IQuotableTemplate = quotableTemplateList.find(
      (selectedTemplate) => selectedTemplate.name === templateName
    );

    this.setNewDesignFromTemplate(template.designProps);

    this.eventsService.create(`webstore.quotable-template-modal.applied-template.${templateName}`);
    this.router.navigate(['/products/quotable'], {
      queryParams: {
        designId: null,
      },
      queryParamsHandling: 'merge',
    });
    location.reload();
  }

  getCurrentDesign(): IQoutable {
    // Get design from localstorage
    switch (this.quotableType) {
      case QuotableTypeEnum.babySign:
        return this.localStorageService.getItem<IQoutable>(LocalStorageVars.designBabySign).value;
      case QuotableTypeEnum.loveLetter:
        return this.localStorageService.getItem<IQoutable>(LocalStorageVars.designLoveLetter).value;
      case QuotableTypeEnum.quotable:
      default:
        return this.localStorageService.getItem<IQoutable>(LocalStorageVars.designQuotable).value;
    }
  }

  setNewDesignFromTemplate(quotableDesign: IQoutable): void {
    // Set the new design in localstorage
    switch (this.quotableType) {
      case QuotableTypeEnum.babySign:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designBabySign, quotableDesign);
        break;
      case QuotableTypeEnum.loveLetter:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designLoveLetter, quotableDesign);
        break;
      case QuotableTypeEnum.quotable:
      default:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designQuotable, quotableDesign);
    }
  }
}
