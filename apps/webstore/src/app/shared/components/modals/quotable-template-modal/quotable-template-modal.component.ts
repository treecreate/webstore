import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IQuotableTemplate } from '@interfaces';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-quotable-template-modal',
  templateUrl: './quotable-template-modal.component.html',
  styleUrls: ['./quotable-template-modal.component.scss'],
})
export class QuotableTemplateModalComponent implements OnInit {
  templateList: IQuotableTemplate[] = [
    {
      name: 'Til mor',
      text: 'SKRRRRT',
    },
    {
      name: 'Til far',
      text: 'WOOp',
    },
    {
      name: 'Til Hende',
      text: 'Smut sut',
    },
    {
      name: 'Til Ham',
      text: 'Slik eller ik',
    },
    {
      name: '',
      text: '',
    },
    {
      name: '',
      text: '',
    },
  ];

  constructor(private activatedRoute: ActivatedRoute, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  applyTemplate(templateName: string): void {}
}
