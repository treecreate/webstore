import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuotableDesignEnum } from '@assets';
import { DesignFontEnum, IQoutable, IQuotableTemplate } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from '../../../services/events/events.service';

@Component({
  selector: 'webstore-quotable-template-modal',
  templateUrl: './quotable-template-modal.component.html',
  styleUrls: ['./quotable-template-modal.component.scss', '../../../../../assets/styles/terms-and-conditions.css'],
})
export class QuotableTemplateModalComponent {
  templateList: IQuotableTemplate[] = [
    {
      name: 'Til Farmor/Farfar',
      text: 'Det eneste bedre \nend at have dig som \nMOR/FAR\n\nEr at mine børn har dig\nsom FARMOR/FARFAR',
      showText: true,
      showTitle: false,
      title: '',
      fontSize: 20,
    },
    {
      name: 'Til Mor/Far',
      text: 'Jeg elsker dig MOR/FAR,\nsom træer elsker vand og solskin.\nDu hjælper mig med at vokse,\ntrives og nå nye højder.\n\nDin SØN/DATTER\nNAVN',
      showText: true,
      showTitle: false,
      title: '',
      fontSize: 20,
    },
    {
      name: 'Til Mor/Far',
      text: 'MOR/FAR,\njeg vil gerne takke dig\nfor at have spillet en så utrolig\nrolle i mit liv.\n\nJeg elsker dig nu og for evigt.\nNAVN',
      showText: true,
      showTitle: false,
      title: '',
      fontSize: 20,
    },
    {
      name: 'Til Ham/Hende',
      text: 'Jeg skrev dit navn i skyerne,\nmen vinden blæste det væk.\n\nJeg skrev dit navn i sandet,\nmen bølgerne skyllede det væk.\n\nJeg skrev dit navn i mit hjerte,\nog for evigt vil det blive der.',
      showText: true,
      showTitle: false,
      title: '',
      fontSize: 20,
    },
    {
      name: 'Barnedåb',
      text: 'NAVN\n\n01.01.21 - kl.00.00\n\n4000g - 50cm',
      showText: true,
      showTitle: false,
      title: '',
      fontSize: 20,
    },
    {
      name: 'Barnedåb 2',
      text: 'NAVN\n\nFødsel: 01.01.21\nVægt: 4000g\nHøjde: 50cm\nKlokken: 00.00\nDåb: 01.01.21',
      showText: true,
      showTitle: false,
      title: 'hva så derrrr',
      fontSize: 20,
    },
  ];

  constructor(
    private localStorageService: LocalStorageService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private eventsService: EventsService
  ) {}

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
