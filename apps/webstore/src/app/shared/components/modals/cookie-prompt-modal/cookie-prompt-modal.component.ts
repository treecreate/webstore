import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  LocalStorageService,
  LocalStorageVars,
} from '../../../services/local-storage';
import { TermsOfUseComponent } from '../terms-of-use/terms-of-use.component';

@Component({
  selector: 'webstore-cookie-prompt-modal',
  templateUrl: './cookie-prompt-modal.component.html',
  styleUrls: ['./cookie-prompt-modal.component.css'],
})
export class CookiePromptModalComponent implements OnInit {
  constructor(
    public activeModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private modalService: NgbModal
  ) {}

  acceptCookies() {
    this.localStorageService.setItem(LocalStorageVars.cookies, true);
    this.activeModal.close();
    console.log(
      `Cookies are now accepted: ${this.localStorageService
        .getItem<Boolean>(LocalStorageVars.cookies)
        .getValue()}`
    );
  }

  termsOfUseModal() {
    this.modalService.open(TermsOfUseComponent, { size: 'lg' });
  }

  ngOnInit(): void {}
}
