import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import {
  LocalStorageService,
  LocalStorageVars,
} from '../../services/local-storage';
import { TermsOfUseModalComponent } from '../modals/terms-of-use-modal/terms-of-use-modal.component';

@Component({
  selector: 'webstore-cookie-prompt',
  templateUrl: './cookie-prompt.component.html',
  styleUrls: [
    './cookie-prompt.component.css',
    '../../../../assets/styles/modals.css',
  ],
})
export class CookiePromptComponent implements OnInit {
  closeResult = '';
  @ViewChild('content', { static: true }) private content;
  cookiesAccepted$: BehaviorSubject<Boolean>;

  constructor(
    private modalService: NgbModal,
    private localStorageService: LocalStorageService
  ) {
    this.cookiesAccepted$ = this.localStorageService.getItem<Boolean>(
      LocalStorageVars.cookiesAccepted
    );
  }

  ngOnInit(): void {
    if (!this.cookiesAccepted$.getValue())
      this.modalService
        .open(this.content, {
          ariaLabelledBy: 'modal-basic-title',
          backdrop: 'static',
          keyboard: false,
        })
        .result.then(
          (result) => {
            switch (result) {
              case 'accept':
                console.log('They accepted!');
                this.acceptCookies();
                break;
              case 'reject':
                console.log('We got rejected...');
                break;
              default:
                console.log("I don't know what happened to the cookies...");
            }
          },
          () => {
            console.log(
              'Wow, you have managed to bypass the cookie prompt. Guess you have rejected them, off to the cookie gulag you go'
            );
          }
        );
  }

  acceptCookies() {
    this.localStorageService.setItem(LocalStorageVars.cookiesAccepted, true);
  }

  showTermsOfUse() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }
}
