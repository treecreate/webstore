import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivacyNoticeModalComponent } from '../modals/privacy-notice-modal/privacy-notice-modal.component';
import { TermsOfUseModalComponent } from '../modals/terms-of-use-modal/terms-of-use-modal.component';

@Component({
  selector: 'webstore-footer',
  templateUrl: './footer.component.html',
  styleUrls: [
    './footer.component.css',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class FooterComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  termsOfUseModal() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }

  privacyNoticeModal() {
    this.modalService.open(PrivacyNoticeModalComponent, { size: 'lg' });
  }
}
