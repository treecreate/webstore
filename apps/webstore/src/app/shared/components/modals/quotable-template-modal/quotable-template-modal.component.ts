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
  quotableType?: QuotableType;

  templateList: IQuotableTemplate[];

  constructor(
    private localStorageService: LocalStorageService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private eventsService: EventsService
  ) {}

  ngOnInit() {
    // Set templates to display based of quotable type
    this.templateList = this.quotableType
      ? quotableTemplateList.filter((template) => template.type === this.quotableType)
      : quotableTemplateList;
  }

  applyTemplate(templateName: string): void {
    const template: IQuotableTemplate = this.templateList.find(
      (selectedTemplate) => selectedTemplate.name === templateName
    );

    // Get transactionItems from localstorage
    let quotableDesign: IQoutable = this.localStorageService.getItem<IQoutable>(LocalStorageVars.designQuotable).value;

    if (quotableDesign) {
      quotableDesign.fontSize = template.fontSize;
      quotableDesign.text = template.text;
    } else {
      quotableDesign = {
        font: DesignFontEnum.calendasItalic,
        fontSize: template.fontSize,
        designSrc: QuotableDesignEnum.frame1,
        text: template.text,
      };
    }

    this.localStorageService.setItem<IQoutable>(LocalStorageVars.designQuotable, quotableDesign);
    this.eventsService.create(`webstore.quotable-template-modal.applied-template.${templateName}`);
    this.router.navigate(['/products/quotable']);
    location.reload();
  }
}
