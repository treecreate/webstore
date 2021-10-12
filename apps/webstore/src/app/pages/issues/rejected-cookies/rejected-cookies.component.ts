import { Component } from '@angular/core';
import { CookieStatus, LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsOfUseModalComponent } from '../../../shared/components/modals/terms-of-use-modal/terms-of-use-modal.component';
import { LocalStorageService } from '../../../shared/services/local-storage';

@Component({
  selector: 'webstore-rejected-cookies',
  templateUrl: './rejected-cookies.component.html',
  styleUrls: ['./rejected-cookies.component.scss'],
})
export class RejectedCookiesComponent {
  constructor(
    private modalService: NgbModal,
    private localStorageService: LocalStorageService
  ) {}

  acceptCookies() {
    this.localStorageService.setItem<CookieStatus>(
      LocalStorageVars.cookiesAccepted,
      CookieStatus.accepted
    );
  }

  showTermsOfUse() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }
}
