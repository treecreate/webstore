import { Component, OnInit, ViewChild } from '@angular/core';

import { LocalStorageService } from '@local-storage';
import { CookieStatus, LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { EventsService } from '../../../services/events/events.service';
import { ToastService } from '../../toast/toast-service';
import { TermsOfUseModalComponent } from '../terms-of-use-modal/terms-of-use-modal.component';

@Component({
  selector: 'webstore-cookie-prompt-modal',
  templateUrl: './cookie-prompt-modal.component.html',
  styleUrls: ['./cookie-prompt-modal.component.css', '../../../../../assets/styles/modals.css'],
})
export class CookiePromptModalComponent implements OnInit {
  closeResult = '';
  @ViewChild('content', { static: true }) private content;
  cookiesAccepted$: BehaviorSubject<CookieStatus>;

  constructor(
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private eventsService: EventsService
  ) {
    this.cookiesAccepted$ = this.localStorageService.getItem<CookieStatus>(LocalStorageVars.cookiesAccepted);
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
    this.localStorageService.setItem<CookieStatus>(LocalStorageVars.cookiesAccepted, CookieStatus.accepted);
    this.toastService.showAlert(
      'Thank you for accepting our cookies!',
      'Tak fordi du siger ja til vores cookies!',
      'success',
      2500
    );
    this.eventsService.create('webstore.cookies-prompt.cookies-accepted');
  }

  rejectCookies() {
    this.localStorageService.setItem<CookieStatus>(LocalStorageVars.cookiesAccepted, CookieStatus.rejected);
    this.toastService.showAlert(
      'You wont be able to access the page without accepting our cookies. :( ',
      'Du kan desværre ikke bruge siden uden at accepterer vores cookies. :( ',
      'danger',
      2500
    );
    this.eventsService.create('webstore.cookies-prompt.cookies-rejected');
  }

  showTermsOfUse() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }
}
