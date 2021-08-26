import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/authentication/auth.service';
import { PrivacyNoticeModalComponent } from '../modals/privacy-notice-modal/privacy-notice-modal.component';
import { TermsOfSaleModalComponent } from '../modals/terms-of-sale-modal/terms-of-sale-modal.component';
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
  public isLoggedIn: boolean;
  private authUser$: BehaviorSubject<string>;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService
  ) {
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn =
        this.authUser$.getValue() != null &&
        this.authService.isAccessTokenValid();
    });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  showTermsOfUse() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }

  showTermsOfSale() {
    this.modalService.open(TermsOfSaleModalComponent, { size: 'lg' });
  }

  showPrivacyNotice() {
    this.modalService.open(PrivacyNoticeModalComponent, { size: 'lg' });
  }
}
