import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IQuotableTemplate } from '@interfaces';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-quotable-template-modal',
  templateUrl: './quotable-template-modal.component.html',
  styleUrls: ['./quotable-template-modal.component.scss', '../../../../../assets/styles/terms-and-conditions.css'],
})
export class QuotableTemplateModalComponent implements OnInit {
  templateList: IQuotableTemplate[] = [
    {
      name: 'Til Farmor/Farfar',
      text: 'Det eneste bedre \nend at have dig som \nMOR/FAR\n\nEr at mine børn har dig\nsom FARMOR/FARFAR',
      fontSize: 20,
    },
    {
      name: 'Til Mor/Far',
      text: 'Jeg elsker dig MOR/FAR,\nsom træer elsekr vand og solskin.\nDu hjælper mig med at vokse,\ntrives og nå nye højder.\n\nDin SØN/DATTER\nNAVN',
      fontSize: 20,
    },
    {
      name: 'Til Mor/Far',
      text: 'MOR/FAR,\njeg vil gerne takke dig\nfor at have spillet en så utrolig\nrolle i mit liv.\n\nJeg elsker dig nu og for evigt.\nNAVN',
      fontSize: 20,
    },
    {
      name: 'Til Ham/Hende',
      text: 'Jeg skrev dit navn i skyerne,\nmen vinden blæste det væk.\n\nJeg skrev dit navn i sandet,\nmen bølgerne skyllede det væk.\n\nJeg skrev dit navn i mit hjerte,\nog for evigt vil det blive der.',
      fontSize: 20,
    },
    {
      name: 'Barnedåb',
      text: 'NAVN\n\n01.01.21 - kl.00.00\n\n4000g - 50cm',
      fontSize: 20,
    },
    {
      name: 'Barnedåb 2',
      text: 'NAVN\n\nFødsel: 01.01.21\nVægt: 4000g\nHøjde: 50cm\nKlokken: 00.00\nDåb: 01.01.21',
      fontSize: 20,
    },
  ];

  constructor(private activatedRoute: ActivatedRoute, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  applyTemplate(templateName: string): void {}
}
