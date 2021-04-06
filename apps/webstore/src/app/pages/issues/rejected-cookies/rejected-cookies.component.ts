import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieStatus } from '../../../shared/components/modals/cookie-prompt-modal/cookie-prompt.constants';
import { TermsOfUseModalComponent } from '../../../shared/components/modals/terms-of-use-modal/terms-of-use-modal.component';
import {
  LocalStorageService,
  LocalStorageVars,
} from '../../../shared/services/local-storage';

@Component({
  selector: 'webstore-rejected-cookies',
  templateUrl: './rejected-cookies.component.html',
  styleUrls: ['./rejected-cookies.component.scss'],
})
export class RejectedCookiesComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {}

  acceptCookies() {
    this.localStorageService.setItem(
      LocalStorageVars.cookiesAccepted,
      CookieStatus.accepted
    );
  }

  showTermsOfUse() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }
}
