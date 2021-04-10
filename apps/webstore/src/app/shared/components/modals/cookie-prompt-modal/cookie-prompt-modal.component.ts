import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../../../services/local-storage';
import { TermsOfUseModalComponent } from '../terms-of-use-modal/terms-of-use-modal.component';
import { CookieStatus, LocalStorageVars } from '@models';

@Component({
  selector: 'webstore-cookie-prompt-modal',
  templateUrl: './cookie-prompt-modal.component.html',
  styleUrls: [
    './cookie-prompt-modal.component.css',
    '../../../../../assets/styles/modals.css',
  ],
})
export class CookiePromptModalComponent implements OnInit {
  closeResult = '';
  @ViewChild('content', { static: true }) private content;
  cookiesAccepted$: BehaviorSubject<CookieStatus>;

  constructor(
    private modalService: NgbModal,
    private localStorageService: LocalStorageService
  ) {
    this.cookiesAccepted$ = this.localStorageService.getItem<CookieStatus>(
      LocalStorageVars.cookiesAccepted
    );
  }

  ngOnInit(): void {
    if (this.cookiesAccepted$.getValue() !== CookieStatus.accepted)
      this.modalService
        .open(this.content, {
          ariaLabelledBy: 'modal-basic-title',
          backdrop: 'static',
          keyboard: false,
        })
        .result.then(
          (result) => {
            if (result === 'accept') this.acceptCookies();
          },
          () => {
            // this shouldn't happen and means that the user has closed the prompt in an unexpected manner
            console.log(
              'Wow, you have managed to bypass the cookie prompt. Guess you have rejected them, off to the cookie gulag you go'
            );
          }
        );
  }

  acceptCookies() {
    this.localStorageService.setItem(
      LocalStorageVars.cookiesAccepted,
      CookieStatus.accepted
    );
  }

  rejectCookies() {
    this.localStorageService.setItem(
      LocalStorageVars.cookiesAccepted,
      CookieStatus.rejected
    );
  }

  showTermsOfUse() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }
}
