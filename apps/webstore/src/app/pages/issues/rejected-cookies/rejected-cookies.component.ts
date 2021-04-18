import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsOfUseModalComponent } from '../../../shared/components/modals/terms-of-use-modal/terms-of-use-modal.component';
import { LocalStorageService } from '../../../shared/services/local-storage';
import { CookieStatus, LocalStorageVars } from '@models';

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

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
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
