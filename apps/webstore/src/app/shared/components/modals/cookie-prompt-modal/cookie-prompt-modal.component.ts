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
  showCookiePrompt: Boolean = false;

  constructor(
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private eventsService: EventsService
  ) {
    this.cookiesAccepted$ = this.localStorageService.getItem<CookieStatus>(LocalStorageVars.cookiesAccepted);
  }

  ngOnInit(): void {
    console.log(this.showCookiePrompt);
    
    if (this.cookiesAccepted$.value !== undefined) {
      this.showCookiePrompt = true;
    } else {
      this.showCookiePrompt = false;
    }
  }

  close(acceptance: string) {
    switch (acceptance) {
      case 'accept':
        this.localStorageService.setItem<CookieStatus>(LocalStorageVars.cookiesAccepted, CookieStatus.accepted);
        this.toastService.showAlert(
          'Thank you for accepting our cookies!',
          'Tak fordi du siger ja til vores cookies!',
          'success',
          2500
        );
        this.eventsService.create('webstore.cookies-prompt.cookies-accepted');
        break;
      case 'reject':
        this.localStorageService.setItem<CookieStatus>(LocalStorageVars.cookiesAccepted, CookieStatus.rejected);
        this.toastService.showAlert(
          'You will only be storing minimal information locally in your browser. :) ',
          'Du gemmer kun essentielle informationer localt i din browser. :) ',
          'success',
          2500
        );
        this.eventsService.create('webstore.cookies-prompt.cookies-rejected');
        break;
    }
  }

  showTermsOfUse() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }
}
