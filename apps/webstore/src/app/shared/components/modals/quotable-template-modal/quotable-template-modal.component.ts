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
      name: 'Til farmor',
      text: 'Det eneste bedre \nend at have dig som \nmor\n\nEr at mine børn har dig\nsom Farmor',
      fontSize: 20,
    },
    {
      name: 'Til mor',
      text: 'Jeg elsker dig mor,\nsom træer elsekr vand og solskin.\nDu hjælper mig med at vokse,\ntrives og nå nye højder.\n\nDin datter NAVN',
      fontSize: 20,
    },
    {
      name: 'Til Hende',
      text: 'Smut sut',
      fontSize: 20,
    },
    {
      name: 'Til Ham',
      text: 'Slik eller ik',
      fontSize: 20,
    },
    {
      name: '',
      text: '',
      fontSize: 20,
    },
    {
      name: '',
      text: '',
      fontSize: 20,
    },
  ];

  constructor(private activatedRoute: ActivatedRoute, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  applyTemplate(templateName: string): void {}
}
