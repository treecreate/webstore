import { Component } from '@angular/core';
import { LocalStorageService } from '@local-storage';
import { CookieStatus, LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsOfUseModalComponent } from '../../../shared/components/modals/terms-of-use-modal/terms-of-use-modal.component';
import { EventsService } from '../../../shared/services/events/events.service';

@Component({
  selector: 'webstore-rejected-cookies',
  templateUrl: './rejected-cookies.component.html',
  styleUrls: ['./rejected-cookies.component.scss'],
})
export class RejectedCookiesComponent {
  constructor(
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
    private eventsService: EventsService
  ) {}

  acceptCookies() {
    this.localStorageService.setItem<CookieStatus>(LocalStorageVars.cookiesAccepted, CookieStatus.accepted);
    this.eventsService.create('webstore.rejected-cookies.cookies-accepted');
  }

  showTermsOfUse() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }
}
