import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuotableDesignEnum } from '@assets';
import { DesignFontEnum, IQoutable, IQuotableTemplate, QuotableType } from '@interfaces';
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
  quotableType!: QuotableType;

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

    let quotableDesign = this.getCurrentDesign();

    quotableDesign.fontSize = template.fontSize;
    quotableDesign.showTitle = template.showTitle;
    quotableDesign.title = template.title;
    quotableDesign.showText = template.showText;
    quotableDesign.text = template.text;

    this.setNewDesignFromTemplate(quotableDesign);

    this.eventsService.create(`webstore.quotable-template-modal.applied-template.${templateName}`);
    this.router.navigate(['/products/quotable']);
    location.reload();
  }

  getCurrentDesign(): IQoutable {
    // Get design from localstorage
    switch (this.quotableType) {
      case QuotableType.babySign:
        return this.localStorageService.getItem<IQoutable>(LocalStorageVars.designBabySign).value;
      case QuotableType.loveLetter:
        return this.localStorageService.getItem<IQoutable>(LocalStorageVars.designLoveLetter).value;
      case QuotableType.quotable:
      default:
        return this.localStorageService.getItem<IQoutable>(LocalStorageVars.designQuotable).value;
    }
  }

  setNewDesignFromTemplate(quotableDesign: IQoutable): void {
    // Set the new design in localstorage
    switch (this.quotableType) {
      case QuotableType.babySign:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designBabySign, quotableDesign);
        break;
      case QuotableType.loveLetter:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designLoveLetter, quotableDesign);
        break;
      case QuotableType.quotable:
      default:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designQuotable, quotableDesign);
    }
  }
}
